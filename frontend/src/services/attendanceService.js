import api from './api';

export const attendanceService = {
  getEventAttendance: async (eventId) => {
    const response = await api.get(`/events/${eventId}/attendance`);
    return response.data;
  },

  updateAttendance: async (registrationId, status) => {
    const response = await api.patch(`/registrations/${registrationId}/attendance`, { status });
    return response.data;
  },
};
