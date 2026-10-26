import api from './api';

export const registrationService = {
  registerForEvent: async (eventId) => {
    const response = await api.post(`/events/${eventId}/registrations`);
    return response.data;
  },

  getMyRegistrations: async () => {
    const response = await api.get('/registrations/me');
    return response.data;
  },

  getEventRegistrations: async (eventId) => {
    const response = await api.get(`/events/${eventId}/registrations`);
    return response.data;
  },

  cancelRegistration: async (registrationId) => {
    const response = await api.patch(`/registrations/${registrationId}/cancel`);
    return response.data;
  },
};
