import { create } from 'zustand';
import studentService from '../services/studentService';

const useStudentStore = create((set, get) => ({
  students: [],
  filteredStudents: [],
  filters: {
    course: 'all',
    min10th: 0,
    min12th: 0,
    minGrad: 0,
    minCGPA: 0,
    company: 'all',
    skills: '',
  },
  allSkills: [],
  searchTokens: [],
  isLoading: false,
  error: null,

  fetchStudents: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await studentService.getAllStudents();
      // In the new schema, data already comes with joined summary fields
      const formattedData = data.map(s => {
        let parsedSkills = [];
        try {
          if (typeof s.skills === 'string') {
            if (s.skills.startsWith('[') || s.skills.startsWith('{')) {
              parsedSkills = JSON.parse(s.skills);
            } else if (s.skills.trim() !== '') {
              parsedSkills = s.skills.split(',').map(skill => skill.trim());
            }
          } else if (Array.isArray(s.skills)) {
            parsedSkills = s.skills;
          }
        } catch (e) {
          console.error("Error parsing skills for student:", s.enrollment_no, e);
          parsedSkills = [];
        }

        return {
          ...s,
          skills: parsedSkills,
          aggregate_percentage: Number(s.aggregate_percentage || 0),
          percentage_10th: Number(s.percentage_10th || 0),
          percentage_12th: Number(s.percentage_12th || 0),
          percentage_grad: Number(s.percentage_grad || 0),
          current_cgpa: Number(s.current_cgpa || 0)
        };
      });
      // Extract unique skills
      const skillSet = new Set();
      formattedData.forEach(s => {
        if (Array.isArray(s.skills)) {
          s.skills.forEach(skill => {
            if (skill) skillSet.add(skill.trim());
          });
        }
      });
      const allSkills = Array.from(skillSet).sort();

      set({ 
        students: formattedData, 
        filteredStudents: formattedData, 
        allSkills,
        isLoading: false 
      });
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to fetch students';
      set({ error: message, isLoading: false });
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
      min10th: 0,
      min12th: 0,
      minGrad: 0,
      minCGPA: 0,
      company: 'all',
      skills: '',
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
      filtered = filtered.filter(s => s.course === filters.course);
    }
    
    // Academic threshold filters
    if (filters.min10th > 0) {
      filtered = filtered.filter(s => s.percentage_10th >= filters.min10th);
    }
    if (filters.min12th > 0) {
      filtered = filtered.filter(s => s.percentage_12th >= filters.min12th);
    }
    if (filters.minGrad > 0) {
      filtered = filtered.filter(s => s.percentage_grad >= filters.minGrad);
    }
    if (filters.minCGPA > 0) {
      filtered = filtered.filter(s => s.current_cgpa >= filters.minCGPA);
    }
    
    if (filters.company !== 'all') {
      filtered = filtered.filter(s => s.placed_company === filters.company);
    }
    
    if (filters.skills && filters.skills.trim() !== '') {
      const searchSkills = filters.skills.toLowerCase().split(',').map(s => s.trim()).filter(s => s !== '');
      filtered = filtered.filter(s => {
        const studentSkills = s.skills.map(skill => skill.toLowerCase());
        return searchSkills.every(searchSkill => 
          studentSkills.some(studentSkill => studentSkill.includes(searchSkill))
        );
      });
    }

    if (searchTokens.length > 0) {
      filtered = filtered.filter(s => 
        searchTokens.some(token => 
          s.name.toLowerCase().includes(token.toLowerCase()) ||
          s.enrollment_no.toLowerCase().includes(token.toLowerCase())
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
