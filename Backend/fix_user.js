const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env' });

async function fixUser() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    const email = 'hardikdhawan9311@gmail.com';
    const password = '12345';
    const role = 'placement_officer';
    const name = 'Hardik Dhawan';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Delete existing if any to avoid unique constraint issues if columns are different
    await db.execute('DELETE FROM users WHERE email = ?', [email]);

    // Insert new fixed user
    await db.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    console.log('User fixed/created successfully with hashed password.');
  } catch (err) {
    console.error('Error fixing user:', err);
  } finally {
    await db.end();
  }
}

fixUser();
