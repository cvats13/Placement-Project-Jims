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
        console.log("Initializing unified database tables...");

        // 1. Users Table
        await query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'placement_officer') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 2. Students Table (Revised base profile)
        await query(`
            CREATE TABLE IF NOT EXISTS students (
                student_id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                enrollment_no VARCHAR(50) UNIQUE NOT NULL,
                college_shift VARCHAR(20),
                primary_email VARCHAR(100),
                phone VARCHAR(15),
                student_email VARCHAR(100),
                gender ENUM('Male', 'Female', 'Other'),
                dob DATE,
                pan_india BOOLEAN DEFAULT FALSE,
                linkedin TEXT,
                residence_type VARCHAR(50),
                user_id INT,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 3. Academics Table (Pre-Graduation summaries)
        await query(`
            CREATE TABLE IF NOT EXISTS academics (
                academic_id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                level ENUM('10th', '12th', 'Graduation') NOT NULL,
                board_or_college VARCHAR(255),
                stream VARCHAR(100),
                passing_year YEAR,
                percentage DECIMAL(5,2),
                FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
            )
        `);

        // 4. Academic Semesters Table (Graduation breakdown)
        await query(`
            CREATE TABLE IF NOT EXISTS academic_semesters (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                semester_number INT NOT NULL,
                sgpa DECIMAL(4,2),
                FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
            )
        `);

        // 5. CIA Marks Table
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

        // 6. Mock Tests Table
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

        // 7. Gaps Table
        await query(`
            CREATE TABLE IF NOT EXISTS gaps (
                gap_id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                has_gap BOOLEAN DEFAULT FALSE,
                reason TEXT,
                FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
            )
        `);

        // 8. Family Table
        await query(`
            CREATE TABLE IF NOT EXISTS family (
                family_id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                father_name VARCHAR(100),
                father_occupation VARCHAR(100),
                father_email VARCHAR(100),
                father_phone VARCHAR(15),
                mother_name VARCHAR(100),
                mother_occupation VARCHAR(100),
                mother_email VARCHAR(100),
                mother_phone VARCHAR(15),
                FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
            )
        `);

        // 9. Addresses Table
        await query(`
            CREATE TABLE IF NOT EXISTS addresses (
                address_id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                type ENUM('Permanent', 'Current') NOT NULL,
                address TEXT,
                FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
            )
        `);

        // 10. Experiences Table
        await query(`
            CREATE TABLE IF NOT EXISTS experiences (
                exp_id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                has_experience BOOLEAN DEFAULT FALSE,
                description TEXT,
                internship_details TEXT,
                FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
            )
        `);

        // 11. Placements Table
        await query(`
            CREATE TABLE IF NOT EXISTS placements (
                placement_id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                campus_offer BOOLEAN DEFAULT FALSE,
                details TEXT,
                company VARCHAR(100),
                status VARCHAR(50),
                FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
            )
        `);

        // 12. Documents Table
        await query(`
            CREATE TABLE IF NOT EXISTS documents (
                doc_id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                photo_path TEXT,
                FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
            )
        `);

        // 13. Companies Table
        await query(`
            CREATE TABLE IF NOT EXISTS companies (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                course VARCHAR(50),
                role VARCHAR(100),
                package DECIMAL(10,2),
                status ENUM('Active', 'Closed', 'Upcoming') DEFAULT 'Active',
                email VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 14. Applications Table (Tracking)
        await query(`
            CREATE TABLE IF NOT EXISTS applications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                company_id INT NOT NULL,
                round_reached INT DEFAULT 0,
                status ENUM('Applied', 'In Progress', 'Selected', 'Rejected') DEFAULT 'Applied',
                applied_date DATE,
                FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
                FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
            )
        `);

        console.log("Unified database tables initialized successfully.");

        // SEED DATA (Optional, for development)
        const [companies] = await query("SELECT COUNT(*) as count FROM companies");
        if (companies[0].count === 0) {
            console.log("Seeding initial company data...");
            await query(`
                INSERT INTO companies (name, course, role, package, status, email) VALUES
                ('Google', 'MCA', 'Software Engineer', 15.5, 'Active', 'recruitment@google.com'),
                ('Microsoft', 'MCA', 'SWE Intern', 12.0, 'Upcoming', 'hr@microsoft.com'),
                ('Amazon', 'MCA', 'SDE-1', 14.5, 'Active', 'careers@amazon.com'),
                ('Wipro', 'BCA', 'Process Associate', 3.5, 'Closed', 'hiring@wipro.com'),
                ('TCS', 'BBA', 'HR Executive', 4.0, 'Active', 'hr@tcs.com')
            `);
        }

    } catch (err) {
        console.error("Error during unified database initialization:", err);
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