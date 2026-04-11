import axiosInstance from '../api/axiosInstance';

const ciaCsvService = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post('/cia-import/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  confirmImport: async (batchId, preview) => {
    const response = await axiosInstance.post('/cia-import/confirm', { batchId, preview });
    return response.data;
  },

  getImportHistory: async () => {
    const response = await axiosInstance.get('/cia-import/history');
    return response.data;
  },
};

export default ciaCsvService;
