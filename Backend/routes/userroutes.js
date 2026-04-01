const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Login a user (admin or student)
router.post('/login', userController.loginUser);

module.exports = router;
