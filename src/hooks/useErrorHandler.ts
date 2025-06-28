import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatErrorMessage, AuthenticationError } from '../utils/errorHandler';

interface ErrorState {
  message: string;
  severity: 'error' | 'warning' | 'info' | 'success';
  show: boolean;
}

export const useErrorHandler = (redirectPath?: string) => {
  const navigate = useNavigate();
  const [error, setError] = useState<ErrorState>({
    message: '',
    severity: 'error',
    show: false,
  });

  const handleError = useCallback(
    async (error: unknown) => {
      const message = formatErrorMessage(error);
      
      setError({
        message,
        severity: 'error',
        show: true,
      });

      if (error instanceof AuthenticationError) {
        localStorage.removeItem('token');
        if (redirectPath) {
          navigate(redirectPath);
        }
      }
    },
    [navigate, redirectPath]
  );

  const clearError = useCallback(() => {
    setError(prev => ({ ...prev, show: false }));
  }, []);

  const showSuccess = useCallback((message: string) => {
    setError({
      message,
      severity: 'success',
      show: true,
    });
  }, []);

  return {
    error,
    handleError,
    clearError,
    showSuccess,
  };
}; 