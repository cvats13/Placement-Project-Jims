const db = require('../config/db');

// @desc Login user
// @route POST /api/users/login
exports.loginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ error: 'Please provide email, password and role' });
        }

        // 1. Find user in the database
        const [rows] = await db.query('SELECT * FROM users WHERE username = ? AND role = ?', [email, role]);
        
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials or role' });
        }

        const user = rows[0];

        // 2. Check password (plain text for now)
        if (password !== user.password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // 3. Login success (Return user info)
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Server error during login' });
    }
};
