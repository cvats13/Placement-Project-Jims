const pool = require('./config/db');

const seedDatabase = async () => {
    try {
        console.log("Starting database rebuild and seeding...");
        
        // 1. Drop existing tables safely
        console.log("Dropping old tables...");
        await pool.query('SET FOREIGN_KEY_CHECKS = 0');
        const tables = ['users', 'students', 'academics', 'academic_semesters', 'cia_marks', 'mock_tests', 'gaps', 'family', 'addresses', 'experiences', 'placements', 'documents'];
        for (const t of tables) {
            await pool.query(`DROP TABLE IF EXISTS ${t}`);
        }
        await pool.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log("Creating tables from modern schema...");
        
        await pool.query(`
            CREATE TABLE users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'placement_officer') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE students (
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

        await pool.query(`
            CREATE TABLE academics (
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

        await pool.query(`
            CREATE TABLE academic_semesters (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                semester_number INT NOT NULL,
                sgpa DECIMAL(4,2),
                FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
            )
        `);

        await pool.query(`
            CREATE TABLE cia_marks (
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

        await pool.query(`
            CREATE TABLE mock_tests (
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

        await pool.query(`
            CREATE TABLE gaps (
                gap_id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                has_gap BOOLEAN DEFAULT FALSE,
                reason TEXT,
                FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
            )
        `);

        await pool.query(`
            CREATE TABLE family (
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

        await pool.query(`
            CREATE TABLE addresses (
                address_id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                type ENUM('Permanent', 'Current') NOT NULL,
                address TEXT,
                FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
            )
        `);

        await pool.query(`
            CREATE TABLE experiences (
                exp_id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                has_experience BOOLEAN DEFAULT FALSE,
                description TEXT,
                internship_details TEXT,
                FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
            )
        `);

        await pool.query(`
            CREATE TABLE placements (
                placement_id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                campus_offer BOOLEAN DEFAULT FALSE,
                details TEXT,
                company VARCHAR(100),
                status VARCHAR(50),
                FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
            )
        `);

        await pool.query(`
            CREATE TABLE documents (
                doc_id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                photo_path TEXT,
                FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
            )
        `);

        console.log("Seeding dummy data into all 12 tables...");
        
        await pool.query(`INSERT INTO users (username, password, role) VALUES ('admin_seed', 'password123', 'admin')`);
        await pool.query(`INSERT INTO users (username, password, role) VALUES ('po_seed', 'password123', 'placement_officer')`);
        
        const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya'];
        const lastNames = ['Sharma', 'Verma', 'Gupta', 'Malhotra', 'Singh', 'Patel', 'Kumar', 'Reddy', 'Nair', 'Das'];
        const branches = ['BCA', 'MCA', 'BBA'];

        for (let i = 0; i < 10; i++) {
            const fname = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lname = lastNames[Math.floor(Math.random() * lastNames.length)];
            const name = `${fname} ${lname}`;
            const enrollment_no = `2024SEED${(i + 1).toString().padStart(3, '0')}`;
            const gender = Math.random() > 0.5 ? 'Male' : 'Female';
            const branch = branches[Math.floor(Math.random() * branches.length)];
            
            // 2. Students
            const [studentRes] = await pool.query(`
                INSERT INTO students (name, enrollment_no, college_shift, primary_email, phone, gender, dob, pan_india, linkedin, residence_type)
                VALUES (?, ?, 'Morning', ?, ?, ?, '2002-05-15', true, ?, 'Hostel')
            `, [name, enrollment_no, `${fname.toLowerCase()}.${lname.toLowerCase()}@example.com`, `987654320${i}`, gender, `https://linkedin.com/in/${fname.toLowerCase()}${i}`]);
            
            const student_id = studentRes.insertId;

            // 3. Academics
            const levels = ['10th', '12th', 'Graduation'];
            for (const level of levels) {
                await pool.query(`
                    INSERT INTO academics (student_id, level, board_or_college, stream, passing_year, percentage)
                    VALUES (?, ?, 'CBSE', ?, 2020, ?)
                `, [student_id, level, level === 'Graduation' ? branch : 'Science', 75 + Math.random() * 20]);
            }

            // 4. Semesters
            for (let sem = 1; sem <= 6; sem++) {
                const [semRes] = await pool.query(`
                    INSERT INTO academic_semesters (student_id, semester_number, sgpa)
                    VALUES (?, ?, ?)
                `, [student_id, sem, 7 + Math.random() * 2.5]);
                
                const sem_id = semRes.insertId;

                // 5. CIA Marks
                const subjects = ['Data Structures', 'OS', 'DBMS', 'Networks'];
                for (const subj of subjects) {
                    await pool.query(`
                        INSERT INTO cia_marks (semester_id, subject, cia1, cia2, cia3, average)
                        VALUES (?, ?, ?, ?, ?, ?)
                    `, [sem_id, subj, 15, 18, 17, 16.6]);
                }

                // 6. Mock Tests
                await pool.query(`
                    INSERT INTO mock_tests (semester_id, test_name, test_type, score, percentile, test_date)
                    VALUES (?, 'Mock Test 1', 'Aptitude', ?, ?, '15/05/2024')
                `, [sem_id, 70 + Math.random() * 20, 80 + Math.random() * 15]);
            }

            // 7. Gaps
            await pool.query(`
                INSERT INTO gaps (student_id, has_gap, reason) VALUES (?, false, '')
            `, [student_id]);

            // 8. Family
            await pool.query(`
                INSERT INTO family (student_id, father_name, father_occupation, mother_name, mother_occupation)
                VALUES (?, 'Mr. ${lname}', 'Engineer', 'Mrs. ${lname}', 'Teacher')
            `, [student_id]);

            // 9. Addresses
            await pool.query(`
                INSERT INTO addresses (student_id, type, address) VALUES (?, 'Permanent', '123 Seed Street, Delhi')
            `, [student_id]);

            // 10. Experiences
            await pool.query(`
                INSERT INTO experiences (student_id, has_experience, description, internship_details)
                VALUES (?, true, 'Software Intern', '6 months at TechCorp')
            `, [student_id]);

            // 11. Placements
            const isPlaced = Math.random() > 0.6;
            await pool.query(`
                INSERT INTO placements (student_id, campus_offer, company, status, details)
                VALUES (?, ?, ?, ?, ?)
            `, [student_id, isPlaced, isPlaced ? 'SeedCorp' : null, isPlaced ? 'Placed' : 'Active', isPlaced ? 'Selected for SDE role' : 'Looking for opportunities']);

            // 12. Documents
            await pool.query(`
                INSERT INTO documents (student_id, photo_path) VALUES (?, '/uploads/dummy_photo.jpg')
            `, [student_id]);
        }

        console.log("Database tables created and seeded completely with 10 dummy students in all 12 tables!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedDatabase();

