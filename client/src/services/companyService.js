import axiosInstance from '../api/axiosInstance';

const companyService = {
  getCompanies: async (filters = {}) => {
    const response = await axiosInstance.get('/companies', { params: filters });
    return response.data;
  },

  getTrackingData: async () => {
    const response = await axiosInstance.get('/companies/tracking');
    return response.data;
  },

  getNonApplicants: async () => {
    const response = await axiosInstance.get('/companies/non-applicants');
    return response.data;
  },

  sendMassMail: async (data) => {
    const response = await axiosInstance.post('/companies/send-mail', data);
    return response.data;
  },
};

export default companyService;
