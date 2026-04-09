const mysql = require('mysql2/promise');
require('dotenv').config();

async function seed() {
    const config = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'placement'
    };

    const connection = await mysql.createConnection(config);
    console.log("🚀 Connected to database:", config.database);

    const timestamp = Date.now().toString().slice(-4);

    try {
        // 1. Companies Dummy Data
        const companies = [
            ['Google ' + timestamp, 'B.Tech, MCA', 'Ongoing'],
            ['Microsoft ' + timestamp, 'B.Tech', 'Upcoming'],
            ['Amazon ' + timestamp, 'B.Tech, MCA, MBA', 'Ongoing'],
            ['TCS ' + timestamp, 'BCA, B.Tech, MCA', 'Completed'],
            ['Infosys ' + timestamp, 'BCA, B.Tech', 'Upcoming']
        ];

        console.log("Inserting companies...");
        const [companyResult] = await connection.query(
            "INSERT INTO companies (name, course, status) VALUES ?",
            [companies]
        );
        const firstCompanyId = companyResult.insertId;

        // 2. Students Dummy Data
        const students = [
            ['JIMS' + timestamp + '1', 'Rahul Sharma', 'Shift 1', 'rahul' + timestamp + '@example.com', 'rahul.s@jims.com', '9876543210', 'Male', '2002-05-15', 'linkedin.com/in/rahul', 'github.com/rahul', 'React, Node.js, SQL', 1, 'Local', 'B.Tech'],
            ['JIMS' + timestamp + '2', 'Priya Singh', 'Shift 2', 'priya' + timestamp + '@example.com', 'priya.s@jims.com', '9876543211', 'Female', '2003-08-22', 'linkedin.com/in/priya', 'github.com/priya', 'Java, Spring, MySQL', 0, 'Hostel', 'MCA'],
            ['JIMS' + timestamp + '3', 'Amit Patel', 'Shift 1', 'amit' + timestamp + '@example.com', 'amit.p@jims.com', '9876543212', 'Male', '2002-12-10', 'linkedin.com/in/amit', 'github.com/amit', 'Python, Django, AWS', 1, 'Local', 'B.Tech'],
            ['JIMS' + timestamp + '4', 'Sneha Gupta', 'Shift 2', 'sneha' + timestamp + '@example.com', 'sneha.g@jims.com', '9876543213', 'Female', '2003-03-05', 'linkedin.com/in/sneha', 'github.com/sneha', 'PHP, Laravel, Vue.js', 1, 'Local', 'BCA'],
            ['JIMS' + timestamp + '5', 'Vikram Singh', 'Shift 1', 'vikram' + timestamp + '@example.com', 'vikram.s@jims.com', '9876543214', 'Male', '2002-07-20', 'linkedin.com/in/vikram', 'github.com/vikram', 'C++, Data Structures', 0, 'Local', 'B.Tech']
        ];

        console.log("Inserting students...");
        const [studentResult] = await connection.query(
            "INSERT INTO students (enrollment_no, name, college_shift, primary_email, student_email, phone, gender, dob, linkedin, github, skills, pan_india, residence_type, course) VALUES ?",
            [students]
        );
        const firstStudentId = studentResult.insertId;

        // 3. Dependent Student Data (Academics, Family, etc.)
        for (let i = 0; i < 5; i++) {
            const studentId = firstStudentId + i;

            // Academics
            await connection.query("INSERT INTO academics (student_id, level, board_or_college, stream, passing_year, percentage) VALUES (?, '10th', 'CBSE', 'General', 2018, 92.5)", [studentId]);
            await connection.query("INSERT INTO academics (student_id, level, board_or_college, stream, passing_year, percentage) VALUES (?, '12th', 'CBSE', 'Science', 2020, 88.0)", [studentId]);
            await connection.query("INSERT INTO academics (student_id, level, board_or_college, stream, passing_year, percentage) VALUES (?, 'Graduation', 'GGSIPU', 'Computer Science', 2024, 82.0)", [studentId]);

            // Family
            await connection.query("INSERT INTO family (student_id, father_name, father_occupation, mother_name) VALUES (?, 'Father Name', 'Business', 'Mother Name')", [studentId]);

            // Addresses
            await connection.query("INSERT INTO addresses (student_id, type, address) VALUES (?, 'Permanent', '123 Dummy Street, New Delhi')", [studentId]);

            // Gaps (NEW)
            const hasGap = i % 2 === 0 ? 1 : 0;
            await connection.query("INSERT INTO gaps (student_id, has_gap, reason) VALUES (?, ?, ?)", [studentId, hasGap, hasGap ? "Medical reasons during 12th year" : "N/A"]);

            // Experiences (NEW)
            await connection.query("INSERT INTO experiences (student_id, has_experience, description, internship_details) VALUES (?, 1, 'Summer Internship at Tech Corp', 'Worked on a full-stack React project.')", [studentId]);

            // Placements (NEW)
            await connection.query("INSERT INTO placements (student_id, campus_offer, company, status) VALUES (?, ?, ?, ?)", [studentId, "Dream Offer", "InnovateX", "Placed"]);

            // Semester Marks & related tables
            for (let sem = 1; sem <= 4; sem++) {
                const [semResult] = await connection.query("INSERT INTO academic_semesters (student_id, semester_number, sgpa) VALUES (?, ?, ?)", [studentId, sem, (7.5 + Math.random() * 2).toFixed(2)]);
                const semesterId = semResult.insertId;

                // CIA Marks (NEW)
                const subjects = ['Programming', 'Data Structures', 'Database Systems', 'Management'];
                for (const sub of subjects) {
                    await connection.query("INSERT INTO cia_marks (semester_id, subject, marks) VALUES (?, ?, ?)", [semesterId, sub, (35 + Math.random() * 15).toFixed(2)]);
                }

                // Mock Tests (NEW)
                await connection.query("INSERT INTO mock_tests (semester_id, test_name, marks) VALUES (?, ?, ?)", [semesterId, 'Aptitude Test ' + sem, (70 + Math.random() * 25).toFixed(2)]);
            }
        }

        // 4. Applications Dummy Data
        const appsData = [
            [firstStudentId, firstCompanyId, 'Technical Interview', 'In Progress'],
            [firstStudentId, firstCompanyId + 1, 'Final HR', 'Selected'],
            [firstStudentId + 1, firstCompanyId, 'Aptitude Test', 'Applied'],
            [firstStudentId + 1, firstCompanyId + 2, 'Group Discussion', 'In Progress'],
            [firstStudentId + 2, firstCompanyId + 3, 'Shortlisted', 'Selected'],
            [firstStudentId + 3, firstCompanyId + 4, 'Applied', 'Applied']
        ];

        console.log("Inserting applications...");
        await connection.query(
            "INSERT INTO applications (student_id, company_id, round_reached, status) VALUES ?",
            [appsData]
        );

        console.log("✅ Database seeded with all tables successfully!");
    } catch (err) {
        console.error("❌ Error seeding database:", err);
    } finally {
        await connection.end();
    }
}

seed();
