const xlsx = require('xlsx');
const db = require('../config/db');

/**
 * Service to handle Companies CSV import.
 * CSV Format: Company Name, Target Course, Job Role, Package (LPA), Recruitment Status, Official Email
 */
class CompanyCsvService {
    async processUpload(fileBuffer, fileName, userId) {
        const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawRows = xlsx.utils.sheet_to_json(sheet);
        const rows = rawRows.map(row => {
            const trimmed = {};
            for (const key in row) trimmed[key.trim()] = typeof row[key] === 'string' ? row[key].trim() : row[key];
            return trimmed;
        });

        // Validate userId exists in users table
        let safeUserId = null;
        if (userId) {
            const [userCheck] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
            safeUserId = userCheck.length > 0 ? userId : null;
        }

        const [logResult] = await db.query(
            'INSERT INTO import_logs (file_name, uploaded_by, total_rows, status, module_type) VALUES (?, ?, ?, ?, ?)',
            [fileName, safeUserId, rows.length, 'pending', 'companies']
        );
        const batchId = logResult.insertId;

        const preview = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const validation = this.validateRow(row);
            preview.push({
                row_number: i + 1,
                data: row,
                status: validation.status,
                error: validation.error,
            });
        }

        return { batchId, totalRows: rows.length, preview };
    }

    validateRow(row) {
        const errors = [];
        if (!row['Company Name']) errors.push('Company Name is required');
        if (!row['Target Course']) errors.push('Target Course is required');

        const validStatuses = ['Upcoming', 'Ongoing', 'Completed'];
        if (row['Recruitment Status'] && !validStatuses.includes(row['Recruitment Status'])) {
            errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
        }
        if (row['Package (LPA)'] && isNaN(parseFloat(row['Package (LPA)']))) {
            errors.push('Package must be numeric');
        }
        if (row['Official Email'] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row['Official Email'])) {
            errors.push('Official Email is not valid');
        }

        return errors.length > 0
            ? { status: 'invalid', error: errors.join(', ') }
            : { status: 'valid', error: null };
    }

    async commitImport(batchId, preview) {
        // preview is passed from the frontend (already validated rows)
        // Re-validate + insert only valid rows
        const validRows = preview.filter(r => r.status === 'valid');
        let successCount = 0;
        let failCount = 0;
        const errors = [];

        for (const item of validRows) {
            const row = item.data;
            try {
                await db.query(`
                    INSERT INTO companies (name, course, job_role, package_lpa, status, official_email)
                    VALUES (?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                        course = VALUES(course),
                        job_role = VALUES(job_role),
                        package_lpa = VALUES(package_lpa),
                        status = VALUES(status),
                        official_email = VALUES(official_email)
                `, [
                    row['Company Name'],
                    row['Target Course'],
                    row['Job Role'] || null,
                    row['Package (LPA)'] ? parseFloat(row['Package (LPA)']) : null,
                    row['Recruitment Status'] || 'Upcoming',
                    row['Official Email'] || null,
                ]);
                successCount++;
            } catch (err) {
                failCount++;
                errors.push({ row: item.row_number, error: err.message });
            }
        }

        await db.query(
            'UPDATE import_logs SET success_rows = ?, failed_rows = ?, status = "completed" WHERE id = ?',
            [successCount, failCount, batchId]
        );

        return { successCount, failCount, errors };
    }

    async getHistory() {
        const [rows] = await db.query(
            'SELECT * FROM import_logs WHERE module_type = "companies" ORDER BY created_at DESC LIMIT 50'
        );
        return rows;
    }
}

module.exports = new CompanyCsvService();
