const db = require('../config/db');
const emailService = require('../services/emailService');
const {
    normalizeStudentListRow,
    normalizePlacementRow,
    placementFromSpreadsheet,
} = require('../utils/placementNormalize');
const { normalizeGapsForProfile } = require('../utils/gapNormalize');
const XLSX = require('xlsx');

// @desc Get all students (with summary info for main list)
// @route GET /api/students
exports.getAllStudents = async (req, res) => {
    try {
        const { branch, name } = req.query;
        
        // Base query joins students with their academic records for filtering
        let sql = `
            SELECT 
                s.*, 
                (SELECT percentage FROM academics a10 WHERE a10.student_id = s.student_id AND a10.level = '10th' LIMIT 1) as percentage_10th,
                (SELECT percentage FROM academics a12 WHERE a12.student_id = s.student_id AND a12.level = '12th' LIMIT 1) as percentage_12th,
                (SELECT percentage FROM academics aGrad WHERE aGrad.student_id = s.student_id AND aGrad.level = 'Graduation' LIMIT 1) as percentage_grad,
                (SELECT percentage FROM academics aGrad WHERE aGrad.student_id = s.student_id AND aGrad.level = 'Graduation' LIMIT 1) as aggregate_percentage,
                (SELECT AVG(sgpa) FROM academic_semesters sem WHERE sem.student_id = s.student_id) as current_cgpa,
                p.company as placed_company,
                p.status as placement_status
            FROM students s
            LEFT JOIN placements p ON s.student_id = p.student_id
            WHERE 1=1
        `;
        const params = [];

        if (branch && branch !== 'all') {
            sql += ' AND s.course = ?';
            params.push(branch);
        }

        if (name) {
            sql += ' AND s.name LIKE ?';
            params.push(`%${name}%`);
        }

        const [rows] = await db.query(sql, params);
        res.json(rows.map(normalizeStudentListRow));
    } catch (err) {
        console.error('Error fetching all students:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc Get a single student profile with full details from ALL tables
// @route GET /api/students/:id/full-profile
exports.getStudentAcademicHistory = async (req, res) => {
    try {
        const studentId = req.params.id;

        // 1. Get core student profile
        const [studentRows] = await db.query('SELECT * FROM students WHERE student_id = ?', [studentId]);
        if (studentRows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        const student = studentRows[0];

        // 2. Parallel fetch all related details
        const [
            [academics],
            [family],
            [addresses],
            [gaps],
            [experiences],
            [placements],
            [semesters]
        ] = await Promise.all([
            db.query('SELECT * FROM academics WHERE student_id = ?', [studentId]),
            db.query('SELECT * FROM family WHERE student_id = ?', [studentId]),
            db.query('SELECT * FROM addresses WHERE student_id = ?', [studentId]),
            db.query('SELECT * FROM gaps WHERE student_id = ?', [studentId]),
            db.query('SELECT * FROM experiences WHERE student_id = ?', [studentId]),
            db.query('SELECT * FROM placements WHERE student_id = ?', [studentId]),
            db.query('SELECT * FROM academic_semesters WHERE student_id = ?', [studentId])
        ]);

        // 3. For each semester, get nested CIA marks and Mock Tests
        const academicHistory = await Promise.all(semesters.map(async (sem) => {
            const [ciaMarks] = await db.query('SELECT * FROM cia_marks WHERE semester_id = ?', [sem.id]);
            const [mockTests] = await db.query('SELECT * FROM mock_tests WHERE semester_id = ?', [sem.id]);

            return {
                ...sem,
                ciaMarks,
                mockTests
            };
        }));

        const placementRaw = placements[0] || null;
        res.json({
            student,
            details: {
                academics,
                family: family[0] || null,
                addresses,
                gaps: normalizeGapsForProfile(gaps[0] || null),
                experiences: experiences[0] || null,
                placement: placementRaw ? normalizePlacementRow(placementRaw) : null,
            },
            academicHistory
        });
    } catch (err) {
        console.error('Error fetching full profile:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc Bulk upload student data across multiple tables
// @route POST /api/students/bulk
exports.bulkUploadStudents = async (req, res) => {
    let connection;
    try {
        const { students } = req.body;
        if (!students || !Array.isArray(students)) {
            return res.status(400).json({ error: 'Invalid data format. Expected an array of student objects.' });
        }

        connection = await db.getConnection();
        await connection.beginTransaction();

        const results = {
            processed: 0,
            updated: 0,
            errors: []
        };

        // Helper to parse date from DD/MM/YYYY to YYYY-MM-DD
        const parseDate = (dateStr) => {
            if (!dateStr || dateStr === 'NA') return null;
            const parts = dateStr.split('/');
            if (parts.length === 3) {
                // Return YYYY-MM-DD
                return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            }
            return null;
        };

        for (const data of students) {
            try {
                // 1. Insert/Update Core Student Table
                const [studentRes] = await connection.query(`
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
                    data['College Shift'],
                    data['Primary Email ID'],
                    data['Student JIMS Email Id'],
                    data['Mobile Number'],
                    data['Gender'],
                    parseDate(data['Date of Birth (DD/MM/YYYY Format Only)']),
                    data['LinkedIn Profile Link'],
                    data['GitHub Profile Link'],
                    data['Technical Skills'],
                    data['Open to Pan India Location'] === 'Yes' ? 1 : 0,
                    data['Student Residence / Belong to'],
                    data['Course']
                ]);

                // Get student_id (either from insert or lookup)
                let studentId;
                if (studentRes.insertId) {
                    studentId = studentRes.insertId;
                } else {
                    const [lookup] = await connection.query('SELECT student_id FROM students WHERE enrollment_no = ?', [data['Enrollment No.']]);
                    studentId = lookup[0].student_id;
                }

                // 2. Academics (10th, 12th, Grad)
                const academicLevels = [
                    { level: '10th', board: data['10th Board Name'], year: data['10th passing Year'], pct: data['10th %'] },
                    { level: '12th', board: data['12th Board Name'], year: data['12th Passing Year'], pct: data['12th %'], stream: data['12th Stream'] },
                    { level: 'Graduation', board: data['Graduation College/ Institute Name'], year: data['Graduation Passing Year'], pct: data['Graduation %'], stream: data['Graduation Stream'] }
                ];

                for (const ac of academicLevels) {
                    if (ac.board || ac.pct) {
                        await connection.query(`
                            INSERT INTO academics (student_id, level, board_or_college, stream, passing_year, percentage)
                            VALUES (?, ?, ?, ?, ?, ?)
                            ON DUPLICATE KEY UPDATE board_or_college=VALUES(board_or_college), stream=VALUES(stream), 
                            passing_year=VALUES(passing_year), percentage=VALUES(percentage)
                        `, [studentId, ac.level, ac.board, ac.stream || null, ac.year || null, ac.pct || null]);
                    }
                }

                // 3. Semester SGPAs
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

                // 4. Family Details
                if (data['Fathers Name'] || data['Mothers Name']) {
                    await connection.query(`
                        INSERT INTO family (student_id, father_name, father_occupation, father_email, father_phone, mother_name, mother_phone, mother_email)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                        ON DUPLICATE KEY UPDATE father_name=VALUES(father_name), father_occupation=VALUES(father_occupation), 
                        father_email=VALUES(father_email), father_phone=VALUES(father_phone), 
                        mother_name=VALUES(mother_name), mother_phone=VALUES(mother_phone), mother_email=VALUES(mother_email)
                    `, [
                        studentId, data['Fathers Name'], data['Father Occupation'], 
                        data['Fathers Email ID'], data['Father Mobile No.'],
                        data['Mothers Name'], data['Mothers Mobile Number'], data['Mothers Email ID']
                    ]);
                }

                // 5. Addresses
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

                // 6. Gaps
                if (data['Any Gap']) {
                    await connection.query(`
                        INSERT INTO gaps (student_id, has_gap, reason) VALUES (?, ?, ?)
                        ON DUPLICATE KEY UPDATE has_gap=VALUES(has_gap), reason=VALUES(reason)
                    `, [studentId, data['Any Gap'] === 'Yes' ? 1 : 0, data['Reason of Gap ( if no gap , write NA)']]);
                }

                // 7. Experiences
                if (data['Any previous work Experience'] || data['Internship /Project Details ( otherwise write NA)']) {
                    await connection.query(`
                        INSERT INTO experiences (student_id, has_experience, description, internship_details)
                        VALUES (?, ?, ?, ?)
                        ON DUPLICATE KEY UPDATE has_experience=VALUES(has_experience), 
                        description=VALUES(description), internship_details=VALUES(internship_details)
                    `, [
                        studentId, data['Any previous work Experience'] === 'Yes' ? 1 : 0, 
                        data['What you have done'], data['Internship /Project Details ( otherwise write NA)']
                    ]);
                }

                // 8. Placements
                if (data['Placed Company Name'] || data['Current Placement Status'] || data['Any Previous campus selection/ offer in Graduation.']) {
                    const { company, status } = placementFromSpreadsheet(
                        data['Placed Company Name'],
                        data['Current Placement Status']
                    );
                    await connection.query(`
                        INSERT INTO placements (student_id, campus_offer, company, status)
                        VALUES (?, ?, ?, ?)
                        ON DUPLICATE KEY UPDATE campus_offer=VALUES(campus_offer), 
                        company=VALUES(company), status=VALUES(status)
                    `, [
                        studentId,
                        data['Any Previous campus selection/ offer in Graduation.'] || null,
                        company,
                        status,
                    ]);
                }

                results.processed++;
            } catch (rowErr) {
                console.error(`Error processing row for student ${data['Enrollment No.']}:`, rowErr);
                results.errors.push({
                    enrollment_no: data['Enrollment No.'],
                    error: rowErr.message
                });
            }
        }

        await connection.commit();
        res.json({
            message: `Bulk upload completed. Processed ${results.processed} students successfully.`,
            errors: results.errors
        });

    } catch (err) {
        if (connection) await connection.rollback();
        console.error('Bulk upload server error:', err);
        res.status(500).json({ error: 'Server error during bulk upload' });
    } finally {
        if (connection) connection.release();
    }
};
// @desc Send student details to company via email
// @route POST /api/students/send-to-company
exports.sendStudentsToCompany = async (req, res) => {
    try {
        const { companyEmail, subject, message, sendAsExcel, students } = req.body;

        console.log('📧 Email request received:', { companyEmail, subject, sendAsExcel, studentCount: students?.length });

        if (!companyEmail || !subject || !message) {
            return res.status(400).json({ error: 'Missing required fields: companyEmail, subject, or message' });
        }

        let attachment = null;

        if (sendAsExcel && students && Array.isArray(students) && students.length > 0) {
            console.log('📊 Generating Excel attachment for', students.length, 'students');
            
            // Map student data for Excel
            const excelData = students.map(s => ({
                'Name': s.name,
                'Enrollment No': s.enrollment_no,
                'Course': s.course,
                'Email': s.student_email || s.primary_email,
                'Phone': s.phone || 'N/A',
                'CGPA': s.current_cgpa || 'N/A',
                '10th %': s.percentage_10th || 'N/A',
                '12th %': s.percentage_12th || 'N/A',
                'Grad %': s.percentage_grad || 'N/A',
                'Skills': s.skills || 'N/A',
                'LinkedIn': s.linkedin || 'N/A',
                'GitHub': s.github || 'N/A'
            }));

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(excelData);
            XLSX.utils.book_append_sheet(wb, ws, "Students");
            
            // Generate buffer
            const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
            const base64Content = buffer.toString('base64');
            
            attachment = [{
                content: base64Content,
                name: `Student_Details_${new Date().toISOString().split('T')[0]}.xlsx`
            }];
        }

        // Plain text version
        const textContent = message;

        // Minimal HTML
        const htmlContent = `<html><body style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#000;">${message.replace(/\n/g, '<br>')}</body></html>`;

        const result = await emailService.sendBrevoEmail({
            to: companyEmail,
            subject: subject,
            htmlContent: htmlContent,
            textContent: textContent,
            attachment: attachment
        });

        console.log('✅ Email sent successfully! Brevo response:', result);
        res.json({ message: 'Email sent successfully to ' + companyEmail });
    } catch (err) {
        console.error('❌ Error in sendStudentsToCompany:', err.message);
        res.status(500).json({ error: 'Failed to send email: ' + err.message });
    }
};

// @desc Notify selected students via email
// @route POST /api/students/notify-students
exports.notifyStudents = async (req, res) => {
    try {
        const { studentIds, subject, message } = req.body;

        if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
            return res.status(400).json({ error: 'No student IDs provided' });
        }
        if (!subject || !message) {
            return res.status(400).json({ error: 'Subject and message are required' });
        }

        // ✅ ALWAYS fetch fresh data from DB — never trust stale frontend cache
        const placeholders = studentIds.map(() => '?').join(',');
        const [freshStudents] = await db.query(
            `SELECT student_id, name, enrollment_no, course, student_email, primary_email FROM students WHERE student_id IN (${placeholders})`,
            studentIds
        );

        if (freshStudents.length === 0) {
            return res.status(404).json({ error: 'No students found for the given IDs' });
        }

        const results = { sent: [], failed: [] };

        for (const student of freshStudents) {
            // Use the LATEST email from DB, prioritize student_email over primary_email
            const recipientEmail = student.student_email || student.primary_email;
            if (!recipientEmail) {
                results.failed.push({ name: student.name, reason: 'No email address found in database' });
                continue;
            }

            try {
                const personalizedMessage = message
                    .replace(/\[Student Name\]/g, student.name)
                    .replace(/\[Enrollment No\]/g, student.enrollment_no || '')
                    .replace(/\[Course\]/g, student.course || '');

                const htmlContent = `<html><body style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#000;">${personalizedMessage.replace(/\n/g, '<br>')}</body></html>`;

                await emailService.sendBrevoEmail({
                    to: recipientEmail,
                    toName: student.name,
                    subject: subject,
                    htmlContent: htmlContent,
                    textContent: personalizedMessage
                });

                results.sent.push({ name: student.name, email: recipientEmail });
                console.log(`✅ Notified: ${student.name} <${recipientEmail}>`);
            } catch (err) {
                console.error(`❌ Failed to notify ${student.name}:`, err.message);
                results.failed.push({ name: student.name, reason: err.message });
            }
        }

        res.json({
            message: `Notifications sent: ${results.sent.length} succeeded, ${results.failed.length} failed.`,
            sent: results.sent,
            failed: results.failed
        });
    } catch (err) {
        console.error('❌ Error in notifyStudents:', err.message);
        res.status(500).json({ error: 'Failed to send notifications: ' + err.message });
    }
};
