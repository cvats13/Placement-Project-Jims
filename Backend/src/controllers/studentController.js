const db = require('../config/db');

// @desc Get all students (with summary info for main list)
// @route GET /api/students
exports.getAllStudents = async (req, res) => {
    try {
        const { branch, name } = req.query;
        
        // Base query joins students with their current graduation academic profile and latest placement status
        let sql = `
            SELECT 
                s.*, 
                a.stream as branch, 
                a.percentage as aggregate_percentage,
                p.company as placed_company,
                p.status as placement_status
            FROM students s
            LEFT JOIN academics a ON s.student_id = a.student_id AND a.level = 'Graduation'
            LEFT JOIN placements p ON s.student_id = p.student_id
            WHERE 1=1
        `;
        const params = [];

        if (branch && branch !== 'all') {
            sql += ' AND a.stream = ?';
            params.push(branch);
        }

        if (name) {
            sql += ' AND s.name LIKE ?';
            params.push(`%${name}%`);
        }

        const [rows] = await db.query(sql, params);
        res.json(rows);
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

        res.json({
            student,
            details: {
                academics,
                family: family[0] || null,
                addresses,
                gaps: gaps[0] || null,
                experiences: experiences[0] || null,
                placement: placements[0] || null
            },
            academicHistory
        });
    } catch (err) {
        console.error('Error fetching full profile:', err);
        res.status(500).json({ error: 'Server error' });
    }
};
