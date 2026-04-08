import { create } from 'zustand';
import companyService from '../services/companyService';

const useCompanyStore = create((set, get) => ({
  companies: [],
  trackingData: [],
  nonApplicants: [],
  isLoadingCompanies: false,
  isLoadingTracking: false,
  isLoadingNonApplicants: false,
  error: null,

  fetchCompanies: async (filters = {}) => {
    set({ isLoadingCompanies: true, error: null });
    try {
      console.log('Fetching companies with filters:', filters);
      const data = await companyService.getCompanies(filters);
      console.log('Companies fetched:', data.length);
      set({ companies: data, isLoadingCompanies: false });
    } catch (error) {
      console.error('Error fetching companies:', error);
      set({ error: 'Failed to fetch companies', isLoadingCompanies: false });
    }
  },

  fetchTrackingData: async () => {
    set({ isLoadingTracking: true, error: null });
    try {
      console.log('Fetching tracking data...');
      const data = await companyService.getTrackingData();
      console.log('Tracking data fetched:', data.length);
      set({ trackingData: data, isLoadingTracking: false });
    } catch (error) {
      console.error('Error fetching tracking data:', error);
      set({ error: 'Failed to fetch tracking data', isLoadingTracking: false });
    }
  },

  fetchNonApplicants: async () => {
    set({ isLoadingNonApplicants: true, error: null });
    try {
      console.log('Fetching non-applicants...');
      const data = await companyService.getNonApplicants();
      console.log('Non-applicants fetched:', data.length);
      set({ nonApplicants: data, isLoadingNonApplicants: false });
    } catch (error) {
      console.error('Error fetching non-applicants:', error);
      set({ error: 'Failed to fetch non-applicants', isLoadingNonApplicants: false });
    }
  },

  sendMassMail: async (data) => {
    try {
      set({ isLoadingCompanies: true });
      const response = await companyService.sendMassMail(data);
      set({ isLoadingCompanies: false });
      return response;
    } catch (error) {
      set({ error: 'Failed to send mass mail', isLoadingCompanies: false });
      throw error;
    }
  },
}));

export default useCompanyStore;
