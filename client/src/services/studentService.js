import axiosInstance from '../api/axiosInstance';

const studentService = {
  getAllStudents: async () => {
    const response = await axiosInstance.get('/students');
    return response.data;
  },

  getStudentById: async (id) => {
    const response = await axiosInstance.get(`/students/${id}`);
    return response.data;
  },

  uploadStudents: async (students) => {
    // In a real production app, this might be a multipart/form-data upload
    // but here we follow the existing JSON structure.
    const response = await axiosInstance.post('/students/bulk', { students });
    return response.data;
  },

  updateStudent: async (id, data) => {
    const response = await axiosInstance.put(`/students/${id}`, data);
    return response.data;
  },

  deleteStudent: async (id) => {
    const response = await axiosInstance.delete(`/students/${id}`);
    return response.data;
  },
};

export default studentService;
