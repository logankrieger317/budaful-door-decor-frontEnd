import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';
import api from '../utils/api';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

interface LocationState {
  from?: {
    pathname: string;
  };
}

export default function LoginDialog({ open, onClose }: LoginDialogProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      const { token, data } = response.data;
      dispatch(setUser(data.user));
      localStorage.setItem('token', token);
      
      // Close the dialog
      onClose();

      // Get the redirect location from state, or default to profile/admin dashboard
      const state = location.state as LocationState;
      if (state?.from) {
        navigate(state.from.pathname);
      } else {
        // Redirect based on user role
        if (data.user.isAdmin) {
          navigate('/admin/dashboard');
        } else {
          navigate('/profile');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      
      const { token, data } = response.data;
      dispatch(setUser(data.user));
      localStorage.setItem('token', token);
      
      // Close the dialog
      onClose();

      // Get the redirect location from state, or default to profile
      const state = location.state as LocationState;
      if (state?.from) {
        navigate(state.from.pathname);
      } else {
        navigate('/profile'); // New users are never admin
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {isLogin ? 'Login' : 'Register'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={isLogin ? handleLogin : handleRegister}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {!isLogin && (
            <>
              <TextField
                margin="dense"
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                margin="dense"
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </>
          )}
          <TextField
            margin="dense"
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setIsLogin(!isLogin)}
            color="primary"
          >
            {isLogin ? 'Need to register?' : 'Already have an account?'}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              isLogin ? 'Login' : 'Register'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
