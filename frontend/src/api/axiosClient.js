import axios from 'axios';

const axiosClient = axios.create({
  // baseURL: 'http://localhost:8080/api',
   baseURL: 'https://habitude-backend-tsus.onrender.com/api',
 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Auto Refresh on 401 Unauthorized
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const res = await axios.post('https://habitude-backend-tsus.onrender.com/api/auth/refresh', {
            refreshToken: refreshToken,
          });

          const newAccessToken = res.data.accessToken;
          localStorage.setItem('token', newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosClient(originalRequest);
        } catch (refreshErr) {
          // Refresh token bhi expire ho gaya -> Logout user
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.reload();
          return Promise.reject(refreshErr);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;