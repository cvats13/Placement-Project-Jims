import axiosInstance from '../api/axiosInstance';

const companyCsvService = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post('/companies-import/upload', formData);
    return response.data;
  },

  confirmImport: async (batchId, preview) => {
    const response = await axiosInstance.post('/companies-import/confirm', { batchId, preview });
    return response.data;
  },

  getImportHistory: async () => {
    const response = await axiosInstance.get('/companies-import/history');
    return response.data;
  },

  createCompany: async (companyData) => {
    const response = await axiosInstance.post('/companies', companyData);
    return response.data;
  },
};

export default companyCsvService;
