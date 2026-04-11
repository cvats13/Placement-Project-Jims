const express = require('express');
const router = express.Router();
const multer = require('multer');
const ciaCsvController = require('../controllers/ciaCsvController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.use(verifyToken);
router.use(isAdmin);

router.post('/upload', upload.single('file'), ciaCsvController.uploadFile);
router.post('/confirm', ciaCsvController.confirmImport);
router.get('/history', ciaCsvController.getImportHistory);

module.exports = router;
