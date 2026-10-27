import axiosClient from '../../api/axiosClient';

const habitService = {
  // GET /api/habit/my-habits
  getMyHabits: async () => {
    const response = await axiosClient.get('/habit/my-habits');
    return response.data;
  },

  // POST /api/habit/add
  addHabit: async (habitData) => {
    const response = await axiosClient.post('/habit/add', habitData);
    return response.data;
  },
};

export default habitService;