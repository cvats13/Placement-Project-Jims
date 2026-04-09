const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'placement',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

const initializeDatabase = async () => {
    try {
        console.log("🚀 Initializing database schema...");

        // 1. Users Table
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'placement_officer', 'user') NOT NULL DEFAULT 'user',
                is_approved TINYINT(1) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 2. Students Core Table
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS students (
                student_id INT AUTO_INCREMENT PRIMARY KEY,
                enrollment_no VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                college_shift VARCHAR(50),
                primary_email VARCHAR(100),
                student_email VARCHAR(100),
                phone VARCHAR(20),
                gender VARCHAR(20),
                dob DATE,
                linkedin VARCHAR(255),
                github VARCHAR(255),
                skills TEXT,
                pan_india TINYINT(1) DEFAULT 0,
                residence_type VARCHAR(100),
                course VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 3. Academics (Level-based)
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS academics (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                level ENUM('10th', '12th', 'Graduation') NOT NULL,
                board_or_college VARCHAR(255),
                stream VARCHAR(100),
                passing_year INT,
                percentage DECIMAL(5,2),
                FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
                UNIQUE KEY unique_student_level (student_id, level)
            )
        `);

        // 4. Academic Semesters
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS academic_semesters (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                semester_number INT NOT NULL,
                sgpa DECIMAL(4,2),
                FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
                UNIQUE KEY unique_student_semester (student_id, semester_number)
            )
        `);

        // 5. Family Details
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS family (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL UNIQUE,
                father_name VARCHAR(100),
                father_occupation VARCHAR(100),
                father_email VARCHAR(100),
                father_phone VARCHAR(20),
                mother_name VARCHAR(100),
                mother_phone VARCHAR(20),
                mother_email VARCHAR(100),
                FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
            )
        `);

        // 6. Addresses
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS addresses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                type ENUM('Permanent', 'Local') NOT NULL,
                address TEXT,
                FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
                UNIQUE KEY unique_student_address_type (student_id, type)
            )
        `);

        // 7. Gaps
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS gaps (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL UNIQUE,
                has_gap TINYINT(1) DEFAULT 0,
                reason TEXT,
                FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
            )
        `);

        // 8. Experiences
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS experiences (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL UNIQUE,
                has_experience TINYINT(1) DEFAULT 0,
                description TEXT,
                internship_details TEXT,
                FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
            )
        `);

        // 9. Placements
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS placements (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL UNIQUE,
                campus_offer VARCHAR(255),
                company VARCHAR(255),
                status VARCHAR(100),
                FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
            )
        `);

        // 10. CIA Marks
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS cia_marks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                semester_id INT NOT NULL,
                subject VARCHAR(100) NOT NULL,
                marks DECIMAL(5,2),
                FOREIGN KEY (semester_id) REFERENCES academic_semesters(id) ON DELETE CASCADE
            )
        `);

        // 11. Mock Tests
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS mock_tests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                semester_id INT NOT NULL,
                test_name VARCHAR(100) NOT NULL,
                marks DECIMAL(5,2),
                FOREIGN KEY (semester_id) REFERENCES academic_semesters(id) ON DELETE CASCADE
            )
        `);

        // 12. Companies
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS companies (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                course VARCHAR(100),
                status ENUM('Upcoming', 'Ongoing', 'Completed') DEFAULT 'Upcoming',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 13. Applications
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS applications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                company_id INT NOT NULL,
                round_reached VARCHAR(100),
                status ENUM('Applied', 'In Progress', 'Selected', 'Rejected') DEFAULT 'Applied',
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
                FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
            )
        `);

        // 14. Add is_approved to users if it doesn't exist
        await promisePool.query(`
            IF NOT EXISTS (
                SELECT * FROM information_schema.COLUMNS 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = 'users' 
                AND COLUMN_NAME = 'is_approved'
            ) THEN
                ALTER TABLE users ADD COLUMN is_approved TINYINT(1) DEFAULT 0;
            END IF;
        `).catch(err => {
            // MySQL 8.0 doesn't support IF NOT EXISTS in ALTER TABLE directly without a procedure
            // So we try a simpler approach: ignore error if column already exists
            if (err.code !== 'ER_DUP_FIELDNAME') {
                return promisePool.query(`ALTER TABLE users ADD COLUMN is_approved TINYINT(1) DEFAULT 0`).catch(e => {
                    if (e.code !== 'ER_DUP_FIELDNAME') throw e;
                });
            }
        });

        // 15. Ensure role ENUM is correct in users table
        await promisePool.query(`
            ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'placement_officer', 'user') NOT NULL DEFAULT 'user'
        `);

        console.log("✅ Database tables initialized and updated successfully.");
    } catch (err) {
        console.error("❌ Error during database initialization:", err);
        throw err; // Propagate error so server knows initialization failed
    }
};

// Test the connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Connection Failed: SQL Service might be down.", err.message);
    } else {
        console.log("✅ Database connection established.");
        connection.release();
    }
});

// Attach initializeDatabase to the promisePool so it can be awaited in server.js
promisePool.initializeDatabase = initializeDatabase;

module.exports = promisePool;
