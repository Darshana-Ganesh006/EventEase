import api from './api';

export const reportService = {
  getOverview: async () => {
    const response = await api.get('/reports/overview');
    return response.data;
  },

  getEventReports: async () => {
    const response = await api.get('/reports/events');
    return response.data;
  },
};
