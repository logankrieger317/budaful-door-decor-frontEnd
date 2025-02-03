import axios, { AxiosError } from 'axios';

// Using relative URLs since we're proxying through the frontend server
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 29000, // 29 seconds (slightly less than proxy timeout)
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
    });

    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. Please try again.'));
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
      return Promise.reject(new Error('Please log in again.'));
    }

    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }

    return Promise.reject(error);
  }
);

export default api;
