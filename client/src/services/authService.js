import axiosInstance from '../api/axiosInstance';

const authService = {
  login: async (credentials) => {
    const response = await axiosInstance.post('/users/login', credentials);
    return response.data;
  },

  signup: async (userData) => {
    const response = await axiosInstance.post('/users/signup', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },
};

export default authService;
