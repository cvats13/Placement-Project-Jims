const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'backend/.env' });

async function checkUsers() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    const [rows] = await db.execute('SELECT id, name, email, role, password FROM users');
    console.log('Users in database:', JSON.stringify(rows, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await db.end();
  }
}

checkUsers();
