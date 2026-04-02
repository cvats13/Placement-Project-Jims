import { create } from 'zustand';
import studentService from '../services/studentService';

const useStudentStore = create((set, get) => ({
  students: [],
  filteredStudents: [],
  filters: {
    course: 'all',
    ciaThreshold: 0,
    mockTestThreshold: 0,
    company: 'all',
  },
  searchTokens: [],
  isLoading: false,
  error: null,

  fetchStudents: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await studentService.getAllStudents();
      set({ students: data, filteredStudents: data, isLoading: false });
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to fetch students';
      set({ error: message, isLoading: false });
      // In development, if the backend fails, use mock data as fallback
      // This matches the current logic in MainDashboard.jsx
    }
  },

  setStudents: (students) => {
    set({ students, filteredStudents: get().applyFilters(students, get().filters, get().searchTokens) });
  },

  setFilters: (newFilters) => {
    const filters = { ...get().filters, ...newFilters };
    set({ 
      filters, 
      filteredStudents: get().applyFilters(get().students, filters, get().searchTokens) 
    });
  },

  setSearchTokens: (tokens) => {
    set({ 
      searchTokens: tokens, 
      filteredStudents: get().applyFilters(get().students, get().filters, tokens) 
    });
  },

  resetFilters: () => {
    const initialFilters = {
      course: 'all',
      ciaThreshold: 0,
      mockTestThreshold: 0,
      company: 'all',
    };
    set({ 
      filters: initialFilters, 
      searchTokens: [], 
      filteredStudents: get().students 
    });
  },

  // Pure logic for filtering, easier to test and reuse
  applyFilters: (students, filters, searchTokens) => {
    let filtered = [...students];

    if (filters.course !== 'all') {
      filtered = filtered.filter(s => s.branch === filters.course);
    }
    if (filters.ciaThreshold > 0) {
      filtered = filtered.filter(s => (s.avgCIA || 0) >= filters.ciaThreshold);
    }
    if (filters.mockTestThreshold > 0) {
      filtered = filtered.filter(s => (s.avgMockTest || 0) >= filters.mockTestThreshold);
    }

    if (searchTokens.length > 0) {
      filtered = filtered.filter(s => 
        searchTokens.some(token => 
          s.name.toLowerCase().includes(token.toLowerCase()) ||
          s.roll_no.toLowerCase().includes(token.toLowerCase())
        )
      );
    }

    return filtered;
  },

  uploadStudents: async (students) => {
    set({ isLoading: true });
    try {
      await studentService.uploadStudents(students);
      // Re-fetch to sync
      await get().fetchStudents();
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }
}));

export default useStudentStore;
