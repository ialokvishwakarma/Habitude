import axiosClient from '../../api/axiosClient';

const focusService = {
  // GET /api/focus/my-focus
  getMyFocuses: async () => {
    const response = await axiosClient.get('/focus/my-focus');
    return response.data;
  },

  // POST /api/focus/add
  addFocus: async (name) => {
    const response = await axiosClient.post('/focus/add', { name });
    return response.data;
  },

  // PUT /api/focus/update
  updateFocus: async (name, newName) => {
    const response = await axiosClient.put('/focus/update', {
      name: name,
      newName: newName,
    });
    return response.data;
  },

  // DELETE /api/focus/delete/{name}
  deleteFocus: async (name) => {
    const response = await axiosClient.delete(`/focus/delete/${encodeURIComponent(name)}`);
    return response.data;
  },
};

export default focusService;