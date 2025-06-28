import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://budafuldoordecorbackend-production.up.railway.app';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// Create axios instance with default config
const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add CORS configuration
  withCredentials: false,
  timeout: 10000, // 10 second timeout
});

// Add a request interceptor
client.interceptors.request.use(
  (config) => {
    // You can modify the request config here
    // For example, add auth token (unless skipAuth is set)
    const token = localStorage.getItem('token');
    if (token && config.headers && !(config as any).skipAuth) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log the request for debugging
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
client.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log('Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', {
        request: error.request,
        config: error.config,
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API methods
export const api = {
  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const response = await client.get<T>(url, { params });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        data: null as any,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  async post<T>(url: string, data?: any, options?: { skipAuth?: boolean }): Promise<ApiResponse<T>> {
    try {
      const config = options?.skipAuth ? { 
        headers: { 'Content-Type': 'application/json' },
        skipAuth: true
      } as any : {};
      const response = await client.post<T>(url, data, config);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        data: null as any,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await client.put<T>(url, data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        data: null as any,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await client.delete<T>(url);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        data: null as any,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },
};

export default api;
