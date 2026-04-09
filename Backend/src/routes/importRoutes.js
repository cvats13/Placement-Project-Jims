const express = require('express');
const router = express.Router();
const multer = require('multer');
const importController = require('../controllers/importController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// All import routes are protected and admin-only
router.use(verifyToken);
router.use(isAdmin);

router.post('/upload', upload.single('file'), importController.uploadFile);
router.post('/confirm', importController.confirmImport);
router.get('/history', importController.getImportHistory);

module.exports = router;
