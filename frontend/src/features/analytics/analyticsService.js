import axiosClient from '../../api/axiosClient';

const analyticsService = {
  // Single bundled request
  getDashboardAnalytics: async () => {
    const response = await axiosClient.get('/analytics/dashboard');
    return response.data;
  },

  getActivityAnalytics: async () => {
    const response = await axiosClient.get('/analytics/activities');
    return response.data;
  },

  getHabitAnalytics: async () => {
    const response = await axiosClient.get('/analytics/habits');
    return response.data;
  },

  getGoalAnalytics: async () => {
    const response = await axiosClient.get('/analytics/goals');
    return response.data;
  },
};

export default analyticsService; 