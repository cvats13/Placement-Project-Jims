const importService = require('../services/importService');

const safeParseJSON = (data) => {
    if (typeof data === 'object' && data !== null) return data;
    try {
        if (typeof data === 'string') return JSON.parse(data);
    } catch (e) {
        console.error('Safe parse error:', e.message);
    }
    return data;
};

const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { batchId, totalRows } = await importService.processUpload(
            req.file.buffer,
            req.file.originalname,
            req.user.id // Assumes user middleware is populated
        );

        const previewData = await importService.getStagingPreview(batchId);
        
        res.status(200).json({
            message: 'File parsed and staged for review',
            batchId,
            totalRows,
            preview: previewData.map(row => ({
                id: row.id,
                row_number: row.import_row_number,
                enrollment_no: row.enrollment_no,
                data: safeParseJSON(row.raw_data_json),
                status: row.validation_status,
                error: row.error_message
            }))
        });
    } catch (error) {
        console.error('Upload controller error:', error);
        res.status(500).json({ error: error.message || 'Internal server error while processing file' });
    }
};

const confirmImport = async (req, res) => {
    try {
        const { batchId } = req.body;
        if (!batchId) {
            return res.status(400).json({ error: 'Batch ID is required' });
        }

        const result = await importService.commitImport(batchId);
        
        res.status(200).json({
            message: 'Import process completed',
            ...result
        });
    } catch (error) {
        console.error('Confirm import controller error:', error);
        res.status(500).json({ error: error.message || 'Internal server error during final commit' });
    }
};

const getImportHistory = async (req, res) => {
    try {
        const history = await importService.getHistory();
        res.status(200).json(history);
    } catch (error) {
        console.error('History controller error:', error);
        res.status(500).json({ error: 'Failed to fetch import history' });
    }
};

module.exports = {
    uploadFile,
    confirmImport,
    getImportHistory
};
