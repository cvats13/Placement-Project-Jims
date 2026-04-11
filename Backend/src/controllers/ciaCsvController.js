const ciaCsvService = require('../services/ciaCsvService');

const uploadFile = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const result = await ciaCsvService.processUpload(
            req.file.buffer,
            req.file.originalname,
            req.user.id
        );
        res.status(200).json({ message: 'File parsed successfully', ...result });
    } catch (error) {
        console.error('CIA CSV upload error:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

const confirmImport = async (req, res) => {
    try {
        const { batchId, preview } = req.body;
        if (!batchId || !preview) return res.status(400).json({ error: 'batchId and preview are required' });
        const result = await ciaCsvService.commitImport(batchId, preview);
        res.status(200).json({ message: 'Import completed', ...result });
    } catch (error) {
        console.error('CIA CSV confirm error:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

const getImportHistory = async (req, res) => {
    try {
        const history = await ciaCsvService.getHistory();
        res.status(200).json(history);
    } catch (error) {
        console.error('CIA history error:', error);
        res.status(500).json({ error: 'Failed to fetch import history' });
    }
};

module.exports = { uploadFile, confirmImport, getImportHistory };
