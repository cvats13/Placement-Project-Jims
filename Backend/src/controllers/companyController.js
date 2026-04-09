const pool = require('../config/db');

// @desc Get all companies with filters
// @route GET /api/companies
// @access Private (Placement Officer)
const getCompanies = async (req, res) => {
    try {
        const { course, status } = req.query;
        let sql = 'SELECT * FROM companies WHERE 1=1';
        let params = [];

        if (course && course !== 'all') {
            sql += ' AND course = ?';
            params.push(course);
        }

        if (status && status !== 'all') {
            sql += ' AND status = ?';
            params.push(status);
        }

        sql += ' ORDER BY created_at DESC';

        const [rows] = await pool.query(sql, params);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).json({ message: 'Error fetching companies' });
    }
};

// @desc Get tracking data for students
// @route GET /api/companies/tracking
// @access Private (Placement Officer)
const getTrackingData = async (req, res) => {
    try {
        const sql = `
            SELECT 
                s.student_id,
                s.name AS student_name,
                s.course,
                COUNT(a.id) AS applied_companies_count,
                MAX(a.round_reached) AS highest_round_reached,
                CASE 
                    WHEN EXISTS (SELECT 1 FROM applications a2 WHERE a2.student_id = s.student_id AND a2.status = 'Selected') THEN 'Selected'
                    WHEN EXISTS (SELECT 1 FROM applications a2 WHERE a2.student_id = s.student_id AND a2.status = 'In Progress') THEN 'In Progress'
                    WHEN EXISTS (SELECT 1 FROM applications a2 WHERE a2.student_id = s.student_id AND a2.status = 'Applied') THEN 'Applied'
                    WHEN COUNT(a.id) > 0 THEN 'Rejected'
                    ELSE 'Not Applied'
                END AS final_status
            FROM students s
            LEFT JOIN applications a ON s.student_id = a.student_id
            GROUP BY s.student_id, s.name, s.course
        `;

        const [rows] = await pool.query(sql);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching tracking data:', error);
        res.status(500).json({ message: 'Error fetching tracking data' });
    }
};

// @desc Get non-applicants (low participation students)
// @route GET /api/companies/non-applicants
// @access Private (Placement Officer)
const getNonApplicants = async (req, res) => {
    try {
        const sql = `
            SELECT 
                s.name AS student_name,
                s.course,
                (SELECT COUNT(*) FROM companies c WHERE c.course = s.course OR c.course IS NULL) AS eligible_companies,
                COUNT(a.id) AS applied_companies,
                CASE 
                    WHEN COUNT(a.id) = 0 THEN 'Not Applied'
                    WHEN COUNT(a.id) < 2 THEN 'Low Participation'
                    ELSE 'Active'
                END AS participation_status
            FROM students s
            LEFT JOIN applications a ON s.student_id = a.student_id
            GROUP BY s.student_id, s.name, s.course
            HAVING applied_companies < 3  -- Let's define low participation as less than 3 applications
        `;

        const [rows] = await pool.query(sql);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching non-applicants:', error);
        res.status(500).json({ message: 'Error fetching non-applicants' });
    }
};

// @desc Send mass mail to selected companies
// @route POST /api/companies/send-mail
// @access Private (Placement Officer)
const sendMassMail = async (req, res) => {
    try {
        const { recipient_emails, subject, message } = req.body;

        if (!recipient_emails || !subject || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // MOCK: In a real app, use Nodemailer here.
        console.log('Sending Mass Mail to:', recipient_emails);
        console.log('Subject:', subject);
        console.log('Message:', message);

        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        res.status(200).json({ message: 'Mail sent successfully to ' + recipient_emails.length + ' recipients' });
    } catch (error) {
        console.error('Error sending mass mail:', error);
        res.status(500).json({ message: 'Error sending mass mail' });
    }
};

module.exports = {
    getCompanies,
    getTrackingData,
    getNonApplicants,
    sendMassMail
};
