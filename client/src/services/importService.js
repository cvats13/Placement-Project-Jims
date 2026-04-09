import axiosInstance from '../api/axiosInstance';

const importService = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axiosInstance.post('/import/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  confirmImport: async (batchId) => {
    const response = await axiosInstance.post('/import/confirm', { batchId });
    return response.data;
  },

  getImportHistory: async () => {
    const response = await axiosInstance.get('/import/history');
    return response.data;
  },
};

export default importService;
