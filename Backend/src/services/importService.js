const xlsx = require('xlsx');
const db = require('../config/db');
const { placementFromSpreadsheet } = require('../utils/placementNormalize');

// Safe JSON parsing helper to handle MySQL driver double-parsing or weird stringification
const safeParseJSON = (data) => {
    if (typeof data === 'object' && data !== null) return data;
    try {
        if (typeof data === 'string') {
            return JSON.parse(data);
        }
    } catch (e) {
        console.error('Safe parse error for data:', data, e.message);
    }
    return data;
};

/**
 * Service to handle complex student data imports across multiple normalized tables.
 */
class ImportService {
    /**
     * Parses the uploaded file (XLSX or CSV) and validates each row.
     * Stores results in staging area for admin review.
     */
    async processUpload(fileBuffer, fileName, userId) {
        const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Parse and trim all keys (headers) in the data rows
        const rawRows = xlsx.utils.sheet_to_json(sheet);
        const rows = rawRows.map(row => {
            const trimmedRow = {};
            for (const key in row) {
                trimmedRow[key.trim()] = row[key];
            }
            return trimmedRow;
        });

        // 1. Create Import Log entry
        // Validate that the userId actually exists in users table to avoid FK constraint failure
        // (can happen if DB was reset but session tokens still carry old user IDs)
        let safeUserId = null;
        if (userId) {
            const [userCheck] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
            safeUserId = userCheck.length > 0 ? userId : null;
        }

        const [logResult] = await db.query(
            'INSERT INTO import_logs (file_name, uploaded_by, total_rows, status) VALUES (?, ?, ?, ?)',
            [fileName, safeUserId, rows.length, 'pending']
        );
        const batchId = logResult.insertId;

        const stagedRows = [];
        
        // 2. Process and Validate rows one by one (Staging)
        for (let i = 0; i < rows.length; i++) {
            const rawData = rows[i];
            const validationResult = this.validateRow(rawData);
            
            await db.query(
                `INSERT INTO import_staging 
                (batch_id, import_row_number, enrollment_no, raw_data_json, validation_status, error_message) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    batchId, 
                    i + 1, 
                    rawData['Enrollment No.'] || null, 
                    JSON.stringify(rawData), 
                    validationResult.status, 
                    validationResult.error
                ]
            );
        }

        return { batchId, totalRows: rows.length };
    }

    /**
     * Validation logic for a single row
     */
    validateRow(row) {
        const errors = [];

        if (!row['Enrollment No.']) errors.push("Enrollment No. is required");
        if (!row['Student Name']) errors.push("Student Name is required");
        if (!row['Course']) errors.push("Course is required");

        // Basic numeric validations
        const checkNumeric = (field, label) => {
            if (row[field] && isNaN(parseFloat(row[field]))) {
                errors.push(`${label} must be numeric`);
            }
        };

        ['10th %', '12th %', 'Graduation %', 'Sem 1 SGPA', 'Sem 2 SGPA', 'Sem 3 SGPA', 'Sem 4 SGPA', 'Sem 5 SGPA', 'Sem 6 SGPA'].forEach(field => {
            if (row[field] && row[field] !== 'NA') checkNumeric(field, field);
        });

        if (errors.length > 0) {
            return { status: 'invalid', error: errors.join(', ') };
        }
        return { status: 'valid', error: null };
    }

    /**
     * Finalizes the import by moving valid staged rows into production tables.
     * Uses per-student transactions to ensure ACID compliance.
     */
    async commitImport(batchId) {
        const [stagedRows] = await db.query(
            'SELECT * FROM import_staging WHERE batch_id = ? AND validation_status = "valid"',
            [batchId]
        );

        let successCount = 0;
        let failCount = 0;

        for (const staged of stagedRows) {
            const data = safeParseJSON(staged.raw_data_json);
            const connection = await db.getConnection();
            
            try {
                await connection.beginTransaction();

                // 1. Upsert Student Core
                const enrollmentNo = data['Enrollment No.'];
                const studentId = await this.upsertStudent(connection, data);

                // 2. Upsert Academics (10th, 12th, Graduation)
                await this.upsertAcademics(connection, studentId, data);

                // 3. Upsert Semesters
                await this.upsertSemesters(connection, studentId, data);

                // 4. Upsert Family
                await this.upsertFamily(connection, studentId, data);

                // 5. Upsert Gaps
                await this.upsertGaps(connection, studentId, data);

                // 6. Upsert Experiences
                await this.upsertExperiences(connection, studentId, data);

                // 7. Upsert Placements
                await this.upsertPlacements(connection, studentId, data);

                // 8. Upsert Addresses
                await this.upsertAddresses(connection, studentId, data);

                await connection.commit();
                successCount++;
            } catch (err) {
                await connection.rollback();
                console.error(`Error importing row ${staged.import_row_number} (${data['Enrollment No.']}):`, err);
                failCount++;
                // Update staging with commit error
                await db.query(
                    'UPDATE import_staging SET validation_status = "invalid", error_message = ? WHERE id = ?',
                    [`Commit failed: ${err.message}`, staged.id]
                );
            } finally {
                connection.release();
            }
        }

        // Update import log
        await db.query(
            'UPDATE import_logs SET success_rows = ?, failed_rows = ?, status = "completed" WHERE id = ?',
            [successCount, failCount, batchId]
        );

        return { successCount, failCount };
    }

    async upsertStudent(connection, data) {
        const parseDate = (d) => {
            if (!d || d === 'NA') return null;
            if (typeof d === 'number') {
                // Handle Excel serial dates if needed, but here we assume DD/MM/YYYY
                return null; 
            }
            const parts = d.split('/');
            if (parts.length === 3) return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            return null;
        };

        const skills = data['Technical Skills'] 
            ? data['Technical Skills'].split(/[|,\n]/).map(s => s.trim()).filter(Boolean).join(', ')
            : '';

        const [result] = await connection.query(`
            INSERT INTO students 
            (name, enrollment_no, college_shift, primary_email, student_email, phone, gender, dob, linkedin, github, skills, pan_india, residence_type, course)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            name=VALUES(name), college_shift=VALUES(college_shift), primary_email=VALUES(primary_email), 
            student_email=VALUES(student_email), phone=VALUES(phone), gender=VALUES(gender), 
            dob=VALUES(dob), linkedin=VALUES(linkedin), github=VALUES(github), skills=VALUES(skills), 
            pan_india=VALUES(pan_india), residence_type=VALUES(residence_type), course=VALUES(course)
        `, [
            data['Student Name'],
            data['Enrollment No.'],
            data['College Shift'] || 'Morning',
            data['Primary Email ID'],
            data['Student JIMS Email Id'],
            data['Mobile Number'],
            data['Gender'],
            parseDate(data['Date of Birth (DD/MM/YYYY Format Only)']),
            data['LinkedIn Profile Link'],
            data['GitHub Profile Link'],
            skills,
            data['Open to Pan India Location'] === 'Yes' ? 1 : 0,
            data['Student Residence / Belong to'],
            data['Course']
        ]);

        if (result.insertId) return result.insertId;
        
        // If updated, fetch the ID
        const [lookup] = await connection.query('SELECT student_id FROM students WHERE enrollment_no = ?', [data['Enrollment No.']]);
        return lookup[0].student_id;
    }

    async upsertAcademics(connection, studentId, data) {
        const levels = [
            { level: '10th', board: '10th Board Name', year: '10th passing Year', pct: '10th %' },
            { level: '12th', board: '12th Board Name', year: '12th Passing Year', pct: '12th %', stream: '12th Stream' },
            { level: 'Graduation', board: 'Graduation College/ Institute Name', year: 'Graduation Passing Year', pct: 'Graduation %', stream: 'Graduation Stream' }
        ];

        for (const l of levels) {
            if (data[l.pct] && data[l.pct] !== 'NA') {
                await connection.query(`
                    INSERT INTO academics (student_id, level, board_or_college, stream, passing_year, percentage)
                    VALUES (?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE 
                    board_or_college=VALUES(board_or_college), stream=VALUES(stream), 
                    passing_year=VALUES(passing_year), percentage=VALUES(percentage)
                `, [studentId, l.level, data[l.board] || null, data[l.stream] || null, data[l.year] || null, data[l.pct]]);
            }
        }
    }

    async upsertSemesters(connection, studentId, data) {
        for (let i = 1; i <= 6; i++) {
            const sgpa = data[`Sem ${i} SGPA`];
            if (sgpa && sgpa !== 'NA') {
                await connection.query(`
                    INSERT INTO academic_semesters (student_id, semester_number, sgpa)
                    VALUES (?, ?, ?)
                    ON DUPLICATE KEY UPDATE sgpa=VALUES(sgpa)
                `, [studentId, i, sgpa]);
            }
        }
    }

    async upsertFamily(connection, studentId, data) {
        if (data['Fathers Name'] || data['Mothers Name']) {
            await connection.query(`
                INSERT INTO family (student_id, father_name, father_occupation, father_email, father_phone, mother_name, mother_phone, mother_email)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                father_name=VALUES(father_name), father_occupation=VALUES(father_occupation), father_email=VALUES(father_email), 
                father_phone=VALUES(father_phone), mother_name=VALUES(mother_name), mother_phone=VALUES(mother_phone), mother_email=VALUES(mother_email)
            `, [
                studentId, data['Fathers Name'], data['Father Occupation'], data['Fathers Email ID'], 
                data['Father Mobile No.'], data['Mothers Name'], data['Mothers Mobile Number'], data['Mothers Email ID']
            ]);
        }
    }

    async upsertGaps(connection, studentId, data) {
        if (data['Any Gap']) {
            await connection.query(`
                INSERT INTO gaps (student_id, has_gap, reason)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE has_gap=VALUES(has_gap), reason=VALUES(reason)
            `, [studentId, data['Any Gap'] === 'Yes' ? 1 : 0, data['Reason of Gap ( if no gap , write NA)']]);
        }
    }

    async upsertExperiences(connection, studentId, data) {
        if (data['Any previous work Experience'] || data['Internship /Project Details ( otherwise write NA)']) {
            await connection.query(`
                INSERT INTO experiences (student_id, has_experience, description, internship_details)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE has_experience=VALUES(has_experience), description=VALUES(description), internship_details=VALUES(internship_details)
            `, [
                studentId, data['Any previous work Experience'] === 'Yes' ? 1 : 0, 
                data['What you have done'], data['Internship /Project Details ( otherwise write NA)']
            ]);
        }
    }

    async upsertPlacements(connection, studentId, data) {
        if (data['Placed Company Name'] || data['Current Placement Status'] || data['Any Previous campus selection/ offer in Graduation.']) {
            const { company, status } = placementFromSpreadsheet(
                data['Placed Company Name'],
                data['Current Placement Status']
            );
            await connection.query(`
                INSERT INTO placements (student_id, campus_offer, company, status)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE campus_offer=VALUES(campus_offer), company=VALUES(company), status=VALUES(status)
            `, [
                studentId,
                data['Any Previous campus selection/ offer in Graduation.'] || null,
                company,
                status,
            ]);
        }
    }

    async upsertAddresses(connection, studentId, data) {
        if (data['Permanent Address']) {
            await connection.query(`
                INSERT INTO addresses (student_id, type, address) VALUES (?, 'Permanent', ?)
                ON DUPLICATE KEY UPDATE address=VALUES(address)
            `, [studentId, data['Permanent Address']]);
        }
        if (data['Current Address']) {
            await connection.query(`
                INSERT INTO addresses (student_id, type, address) VALUES (?, 'Local', ?)
                ON DUPLICATE KEY UPDATE address=VALUES(address)
            `, [studentId, data['Current Address']]);
        }
    }

    async getHistory() {
        const [rows] = await db.query('SELECT * FROM import_logs ORDER BY created_at DESC LIMIT 50');
        return rows;
    }

    async getStagingPreview(batchId) {
        const [rows] = await db.query('SELECT * FROM import_staging WHERE batch_id = ?', [batchId]);
        return rows;
    }
}

module.exports = new ImportService();
