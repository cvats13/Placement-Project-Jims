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

app.use('/api/students', studentRoutes);
app.use('/api/users', authRoutes); // Map /api/users to authRoutes
app.use('/api/companies', companyRoutes);

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend is running' });
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

