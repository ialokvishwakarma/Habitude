import axiosClient from '../../api/axiosClient';

const activityService = {
  // GET /api/activities/my-activities?page=0&size=20
  getActivities: async (page = 0, size = 20) => {
    const response = await axiosClient.get('/activities/my-activities', {
      params: { page, size },
    });
    return response.data;
  },

  // POST /api/activities/track
  logActivity: async (activityData) => {
    const response = await axiosClient.post('/activities/track', activityData);
    return response.data;
  },

  // PUT /api/activities/update/{id}
  updateActivity: async (id, updateData) => {
    const response = await axiosClient.put(`/activities/update/${id}`, updateData);
    return response.data;
  },

  // DELETE /api/activities/delete/{id}
  deleteActivity: async (id) => {
    const response = await axiosClient.delete(`/activities/delete/${id}`);
    return response.data;
  },
};

export default activityService;