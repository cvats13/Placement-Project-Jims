const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Get all students (with optional filters)
router.get('/', studentController.getAllStudents);

// Get a single student profile with full academic history
router.get('/:id/academic-history', studentController.getStudentAcademicHistory);

// Bulk upload students
router.post('/bulk', studentController.bulkUploadStudents);

module.exports = router;
