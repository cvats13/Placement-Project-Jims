const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'placement_portal',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const initializeDatabase = async () => {
    try {
        console.log("Initializing database tables...");
        // 1. Users Table (Admin and Placement Officer only)
        await pool.promise().query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'placement_officer', 'user') NOT NULL DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Update existing table if needed
        await pool.promise().query(`
            ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'placement_officer', 'user') NOT NULL DEFAULT 'user'
        `);
        console.log("Database tables initialized successfully.");
    } catch (err) {
        console.error("Error during database initialization:", err);
    }
};

initializeDatabase();

// Test the connection immediately
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Error connecting to the database: (Is MySQL Running?)", err);
    } else {
        console.log("Connected to the MySQL database!");
        connection.release();
    }
});

module.exports = pool.promise();
