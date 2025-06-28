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
    event.stopPropagation();
    
    setError('');
    setIsLoading(true);

    console.log('Login attempt with:', { email: formData.email });
    
    // Validate required fields
    if (!formData.email || !formData.password) {
      alert('Please fill in both email and password');
      setError('Please fill in both email and password');
      setIsLoading(false);
      return;
    }
    
    // Add a small delay to ensure we can see logs
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      console.log('Login response:', response);

      // Direct axios response, not wrapped
      const { token, user } = response.data;
      console.log('Login successful, user:', user);
      // Remove alert after debugging
      // alert('Login successful! Redirecting to dashboard...');
      
      dispatch(setUser(user));
      localStorage.setItem('token', token);
      
      // Add a small delay before navigation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Close the dialog
      onClose();

      // Get the redirect location from state, or default to profile/admin dashboard
      const state = location.state as LocationState;
      if (state?.from) {
        console.log('Redirecting to saved location:', state.from.pathname);
        navigate(state.from.pathname);
      } else {
        // Redirect based on user role
        if (user.isAdmin) {
          console.log('Redirecting admin to dashboard');
          navigate('/admin/dashboard');
        } else {
          console.log('Redirecting user to profile');
          navigate('/profile');
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      // Remove alert after debugging
      // alert('Login error: ' + (err.response?.data?.message || err.message || 'An error occurred'));
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      
      // Direct axios response, not wrapped  
      const { token, user } = response.data;
      dispatch(setUser(user));
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
