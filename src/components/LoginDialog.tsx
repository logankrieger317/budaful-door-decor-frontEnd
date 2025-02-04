import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  Alert,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginDialog({
  open,
  onClose,
}: LoginDialogProps): JSX.Element {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      dispatch(setUser(data.data.user));
      localStorage.setItem('token', data.token);
      
      // Close the dialog
      onClose();

      // Get the redirect location from state, or default to profile/admin dashboard
      const location = (window.location.state as any)?.from;
      if (location) {
        navigate(location.pathname);
      } else {
        // Redirect based on user role
        if (data.data.user.isAdmin) {
          navigate('/admin/dashboard');
        } else {
          navigate('/profile');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password, 
          firstName: formData.firstName, 
          lastName: formData.lastName 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      dispatch(setUser(data.data.user));
      localStorage.setItem('token', data.token);
      
      // Close the dialog
      onClose();

      // Get the redirect location from state, or default to profile/admin dashboard
      const location = (window.location.state as any)?.from;
      if (location) {
        navigate(location.pathname);
      } else {
        // Redirect based on user role
        if (data.data.user.isAdmin) {
          navigate('/admin/dashboard');
        } else {
          navigate('/profile');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {isLogin ? "Login" : "Create Account"}
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
          <TextField
            autoFocus
            margin="dense"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            required
            value={formData.email}
            onChange={handleInputChange}
          />
          {!isLogin && (
            <>
              <TextField
                margin="dense"
                name="firstName"
                label="First Name"
                fullWidth
                required
                value={formData.firstName}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="lastName"
                label="Last Name"
                fullWidth
                required
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </>
          )}
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            required
            value={formData.password}
            onChange={handleInputChange}
          />
          <Box mt={2}>
            <Typography variant="body2" color="textSecondary">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <Button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                color="primary"
                sx={{ ml: 1 }}
              >
                {isLogin ? "Sign Up" : "Login"}
              </Button>
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary" variant="contained">
            {isLogin ? "Login" : "Create Account"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
