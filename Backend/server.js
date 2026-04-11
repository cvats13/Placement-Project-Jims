const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for the frontend
app.use(express.json());

// Database connection
const pool = require('./src/config/db');

// Routes
const studentRoutes = require('./src/routes/studentRoutes');
const authRoutes = require('./src/routes/authRoutes');
const companyRoutes = require('./src/routes/companyRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const importRoutes = require('./src/routes/importRoutes');
const companyCsvRoutes = require('./src/routes/companyCsvRoutes');
const ciaCsvRoutes = require('./src/routes/ciaCsvRoutes');
const mockCsvRoutes = require('./src/routes/mockCsvRoutes');

app.use('/api/students', studentRoutes);
app.use('/api/users', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/import', importRoutes);
app.use('/api/companies-import', companyCsvRoutes);
app.use('/api/cia-import', ciaCsvRoutes);
app.use('/api/mock-import', mockCsvRoutes);

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend is running' });
});

const startServer = async () => {
    try {
        // Ensure database is ready before taking requests
        await pool.initializeDatabase();
        
        app.listen(port, () => {
            console.log(`✅ Server is running on port: ${port}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server due to database error:', err);
        process.exit(1);
    }
};

startServer();

