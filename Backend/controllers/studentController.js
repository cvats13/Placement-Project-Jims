const db = require('../config/db');

// @desc Get all students (with optional filters)
// @route GET /api/students
exports.getAllStudents = async (req, res) => {
    try {
        const { branch, minCgpa, name } = req.query;
        let sql = 'SELECT * FROM students WHERE 1=1';
        const params = [];

        if (branch && branch !== 'all') {
            sql += ' AND branch = ?';
            params.push(branch);
        }

        if (minCgpa) {
            sql += ' AND cgpa >= ?';
            params.push(minCgpa);
        }

        if (name) {
            sql += ' AND name LIKE ?';
            params.push(`%${name}%`);
        }

        const [rows] = await db.query(sql, params);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc Get a single student profile with full academic history
// @route GET /api/students/:id/academic-history
exports.getStudentAcademicHistory = async (req, res) => {
    try {
        const studentId = req.params.id;

        // 1. Get student profile
        const [studentRows] = await db.query('SELECT * FROM students WHERE student_id = ?', [studentId]);
        if (studentRows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        const student = studentRows[0];

        // 2. Get semesters
        const [semesters] = await db.query('SELECT * FROM academic_semesters WHERE student_id = ?', [studentId]);

        // 3. For each semester, get CIA marks and Mock Tests
        const academicHistory = await Promise.all(semesters.map(async (sem) => {
            const [ciaMarks] = await db.query('SELECT * FROM cia_marks WHERE semester_id = ?', [sem.id]);
            const [mockTests] = await db.query('SELECT * FROM mock_tests WHERE semester_id = ?', [sem.id]);

            return {
                ...sem,
                ciaMarks,
                mockTests
            };
        }));

        res.json({
            student,
            academicHistory
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
