const express = require('express');
const router = express.Router();
const multer = require('multer');
const companyCsvController = require('../controllers/companyCsvController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.use(verifyToken);
router.use(isAdmin);

router.post('/upload', upload.single('file'), companyCsvController.uploadFile);
router.post('/confirm', companyCsvController.confirmImport);
router.get('/history', companyCsvController.getImportHistory);

module.exports = router;
