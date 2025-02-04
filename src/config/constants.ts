export const API_BASE_URL = 'https://budafuldoordecorbackend-production.up.railway.app/api';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
  },
  ORDERS: {
    LIST: `${API_BASE_URL}/orders`,
    CREATE: `${API_BASE_URL}/orders`,
    DETAILS: (id: string) => `${API_BASE_URL}/orders/${id}`,
  },
  PRODUCTS: {
    LIST: `${API_BASE_URL}/products`,
    DETAILS: (id: string) => `${API_BASE_URL}/products/${id}`,
  },
};
