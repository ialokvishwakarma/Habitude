import axiosClient from '../../api/axiosClient';

const authService = {
  // POST /api/auth/register
  register: async (userData) => {
    const response = await axiosClient.post('/auth/register', userData);
    return response.data;
  },

  // POST /api/auth/login
  login: async (credentials) => {
    const response = await axiosClient.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return response.data;
  },

  // Logout utility
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },

  // Check if logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default authService;