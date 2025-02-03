import axios from 'axios';

// Use environment variable in production, fallback to localhost in development
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.budafuldoordecor.com'
  : 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
