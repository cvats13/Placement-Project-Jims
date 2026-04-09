const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// All routes here should theoretically be protected by admin middleware
// For now, mapping directly for the requested functionality
router.get('/pending-users', adminController.getPendingUsers);
router.post('/approve-user/:id', adminController.approveUser);
router.delete('/reject-user/:id', adminController.rejectUser);

module.exports = router;
