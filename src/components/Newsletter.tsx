import { useState } from 'react';
import { Container, Typography, Box, Button, TextField, Alert, Snackbar, useTheme, alpha } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export default function Newsletter(): JSX.Element {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      // Here you would typically make an API call to subscribe the user
      setShowSuccess(true);
      setEmail('');
    } else {
      setShowError(true);
    }
  };

  return (
    <Box sx={{ 
      position: 'relative',
      py: { xs: 4, sm: 6, md: 8 }, 
      px: 2,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.08)}, ${alpha(theme.palette.primary.main, 0.05)})`,
        zIndex: 0,
      }
    }}>
      <Container maxWidth="sm" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <Typography 
          variant="h2" 
          sx={{ 
            mb: { xs: 2, sm: 3, md: 4 },
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
            fontFamily: '"Playfair Display", serif',
            fontWeight: 600,
            color: theme.palette.primary.main,
            position: 'relative',
            '&::after': {
              content: '""',
              display: 'block',
              width: '60px',
              height: '2px',
              background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
              margin: '15px auto 0',
              borderRadius: '2px',
            }
          }}
        >
          Stay Updated
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: { xs: 2, sm: 3, md: 4 }, 
            color: alpha(theme.palette.text.primary, 0.7),
            fontSize: '1.1rem',
            lineHeight: 1.6,
            letterSpacing: '0.3px'
          }}
        >
          Subscribe to our newsletter for exclusive offers and design tips
        </Typography>
        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            gap: 2,
            alignItems: 'center',
            justifyContent: 'center' 
          }}
        >
          <TextField
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ 
              flexGrow: 1,
              maxWidth: { xs: '100%', sm: '300px' },
              '& .MuiOutlinedInput-root': {
                bgcolor: alpha(theme.palette.background.paper, 0.8),
                borderRadius: '50px',
                transition: 'all 0.3s ease-in-out',
                '& fieldset': {
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                  transition: 'border-color 0.3s ease-in-out',
                },
                '&:hover fieldset': {
                  borderColor: alpha(theme.palette.primary.main, 0.5),
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                  borderWidth: '2px',
                },
              },
              '& .MuiOutlinedInput-input': {
                padding: '14px 20px',
              }
            }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            endIcon={<SendIcon />}
            sx={{
              px: 4,
              py: 1.5,
              minWidth: { xs: '100%', sm: 'auto' },
              borderRadius: '50px',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
              transition: 'all 0.3s ease',
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 500,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
              }
            }}
          >
            Subscribe
          </Button>
        </Box>

        <Snackbar 
          open={showSuccess} 
          autoHideDuration={6000} 
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" onClose={() => setShowSuccess(false)}>
            Thank you for subscribing!
          </Alert>
        </Snackbar>

        <Snackbar
          open={showError}
          autoHideDuration={6000}
          onClose={() => setShowError(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="error" onClose={() => setShowError(false)}>
            Please enter a valid email address.
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
