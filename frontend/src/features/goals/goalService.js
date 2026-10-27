import axiosClient from '../../api/axiosClient';

const goalService = {
  // GET /api/goals/my-goals
  getMyGoals: async () => {
    const response = await axiosClient.get('/goals/my-goals');
    return response.data;
  },

  // POST /api/goals/add
  createGoal: async (goalData) => {
    const response = await axiosClient.post('/goals/add', goalData);
    return response.data;
  },

  // PUT /api/goals/update/{id}
  updateGoal: async (id, updateData) => {
    const response = await axiosClient.put(`/goals/update/${id}`, updateData);
    return response.data;
  },

  // PATCH /api/goals/status/{id}
  updateStatus: async (id, status) => {
    const response = await axiosClient.patch(`/goals/status/${id}`, { status });
    return response.data;
  },

  // DELETE /api/goals/delete/{id}
  deleteGoal: async (id) => {
    const response = await axiosClient.delete(`/goals/delete/${id}`);
    return response.data;
  },
};

export default goalService;