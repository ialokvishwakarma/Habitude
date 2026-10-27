import axiosClient from '../../api/axiosClient';

const userService = {
  // GET /api/user/profile
  getProfile: async () => {
    const response = await axiosClient.get('/user/profile');
    return response.data;
  },

  // PUT /api/user/profile
  updateProfile: async (updateData) => {
    const response = await axiosClient.put('/user/profile', updateData);
    return response.data;
  },
};

export default userService;