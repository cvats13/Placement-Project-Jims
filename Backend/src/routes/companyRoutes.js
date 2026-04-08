const express = require('express');
const router = express.Router();
const { 
    getCompanies, 
    getTrackingData, 
    getNonApplicants, 
    sendMassMail 
} = require('../controllers/companyController');

// Define routes
router.get('/', getCompanies);
router.get('/tracking', getTrackingData);
router.get('/non-applicants', getNonApplicants);
router.post('/send-mail', sendMassMail);

module.exports = router;
