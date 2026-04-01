const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Helper to execute queries during initialization
const query = async (sql, params = []) => {
    return pool.promise().query(sql, params);
};

// Automated table creation schema (uses CREATE TABLE IF NOT EXISTS — safe to run every startup)
const initializeDatabase = async () => {
    try {
        console.log("Initializing database tables...");

        // 1. Users Table — preserved across restarts, any user added here can log in
        await query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'placement_officer') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 2. Students Table
        await query(`
            CREATE TABLE IF NOT EXISTS students (
                student_id INT AUTO_INCREMENT PRIMARY KEY,
                roll_no VARCHAR(20) UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                branch VARCHAR(50) NOT NULL,
                semester INT NOT NULL,
                cgpa DECIMAL(4,2) NOT NULL,
                backlogs INT DEFAULT 0,
                phone VARCHAR(20),
                email VARCHAR(100),
                skills JSON,
                resume_url VARCHAR(255),
                github VARCHAR(255),
                leetcode VARCHAR(255),
                user_id INT,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 3. Academic Semesters Table
        await query(`
            CREATE TABLE IF NOT EXISTS academic_semesters (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                semester_number INT NOT NULL,
                sgpa DECIMAL(4,2) NOT NULL,
                FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
            )
        `);

        // 4. CIA Marks Table
        await query(`
            CREATE TABLE IF NOT EXISTS cia_marks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                semester_id INT NOT NULL,
                subject VARCHAR(100) NOT NULL,
                cia1 INT,
                cia2 INT,
                cia3 INT,
                cia4 INT,
                average DECIMAL(4,2),
                FOREIGN KEY (semester_id) REFERENCES academic_semesters(id) ON DELETE CASCADE
            )
        `);

        // 5. Mock Tests Table
        await query(`
            CREATE TABLE IF NOT EXISTS mock_tests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                semester_id INT NOT NULL,
                test_name VARCHAR(100) NOT NULL,
                test_type VARCHAR(50),
                score INT,
                percentile INT,
                test_date VARCHAR(20),
                FOREIGN KEY (semester_id) REFERENCES academic_semesters(id) ON DELETE CASCADE
            )
        `);

        console.log("Database tables initialized successfully.");

    } catch (err) {
        console.error("Error during database initialization:", err);
    }
};

// Run initialization
initializeDatabase();

pool.getConnection((err, connection) => {
    if (err) {
        console.error("Error connecting to the database:", err);
    } else {
        console.log("Connected to the MySQL database successfully!");
        connection.release();
    }
});

module.exports = pool.promise();