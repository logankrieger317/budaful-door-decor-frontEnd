import { AxiosError } from 'axios';

// Custom error classes
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class AuthenticationError extends Error {
  constructor(message = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public fields?: Record<string, string>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Error handler function
export const handleApiError = (error: unknown): never => {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    throw error;
  }

  if (error instanceof AuthenticationError) {
    // Clear token and redirect to login
    localStorage.removeItem('token');
    window.location.href = '/admin/login';
    throw error;
  }

  if (error instanceof ValidationError) {
    throw error;
  }

  if (error instanceof AxiosError) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message;
    const data = error.response?.data;

    if (status === 401) {
      throw new AuthenticationError(message);
    }

    if (status === 400) {
      throw new ValidationError(message, data?.fields);
    }

    throw new ApiError(status, message, data);
  }

  // Unknown error
  throw new Error('An unexpected error occurred');
};

// Helper function to format error messages for display
export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    return `Error (${error.status}): ${error.message}`;
  }

  if (error instanceof ValidationError) {
    if (error.fields) {
      return Object.entries(error.fields)
        .map(([field, message]) => `${field}: ${message}`)
        .join('\n');
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}; 