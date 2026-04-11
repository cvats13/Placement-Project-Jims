const express = require('express');
const router = express.Router();
const multer = require('multer');
const mockCsvController = require('../controllers/mockCsvController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.use(verifyToken);
router.use(isAdmin);

router.post('/upload', upload.single('file'), mockCsvController.uploadFile);
router.post('/confirm', mockCsvController.confirmImport);
router.get('/history', mockCsvController.getImportHistory);

module.exports = router;
