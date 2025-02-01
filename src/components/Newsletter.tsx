import { useState } from 'react';
import { Container, Typography, Box, Button, TextField, Alert, Snackbar } from '@mui/material';

export default function Newsletter(): JSX.Element {
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
    <Box sx={{ py: { xs: 4, sm: 6, md: 8 }, px: 2, bgcolor: 'background.paper' }}>
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <Typography 
          variant="h2" 
          sx={{ 
            mb: { xs: 2, sm: 3, md: 4 },
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
          }}
        >
          Stay Updated
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: { xs: 2, sm: 3, md: 4 }, 
            color: 'text.secondary'
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
                bgcolor: 'background.paper',
              }
            }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            sx={{
              px: 4,
              py: 1.5,
              minWidth: { xs: '100%', sm: 'auto' }
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
