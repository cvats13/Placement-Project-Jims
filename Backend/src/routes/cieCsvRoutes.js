const express = require('express');
const router = express.Router();
const multer = require('multer');
const cieCsvController = require('../controllers/cieCsvController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.use(verifyToken);
router.use(isAdmin);

router.post('/upload', upload.single('file'), cieCsvController.uploadFile);
router.post('/confirm', cieCsvController.confirmImport);
router.get('/history', cieCsvController.getImportHistory);

module.exports = router;
