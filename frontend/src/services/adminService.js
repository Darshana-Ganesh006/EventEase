import api from './api';

export const adminService = {
  getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  updateUserStatus: async (userId, active) => {
    const response = await api.patch(`/admin/users/${userId}/status`, { active });
    return response.data;
  },
};
