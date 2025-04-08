import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Snackbar,
  Alert,
  MenuItem,
  alpha,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface FormData {
  name: string;
  email: string;
  phone: string;
  inquiryType: string;
  message: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  inquiryType: '',
  message: '',
};

const inquiryTypes = [
  'Custom Order Request',
  'Product Inquiry',
  'Wholesale Information',
  'General Question',
  'Other'
];

export default function Contact(): JSX.Element {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    if (formData.name && formData.email && formData.message && formData.inquiryType) {
      setShowSuccess(true);
      setFormData(initialFormData);
    } else {
      setShowError(true);
    }
  };

  return (
    <Box sx={{
      py: { xs: 4, md: 8 },
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
      }
    }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 6, md: 10 },
          mb: { xs: 4, md: 8 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${alpha('#87A878', 0.4)} 0%, ${alpha('#B5C5AA', 0.2)} 100%)`,
            zIndex: 0,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '120%',
            height: '120%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            zIndex: 1,
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 2,
              textAlign: 'center',
            }}
          >
            Let's Connect!
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              maxWidth: '800px',
              mx: 'auto',
              textAlign: 'center',
              opacity: 0.9,
            }}
          >
            Whether you need custom designs, crafting supplies, or have questions about our products, I'm here to help!
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <Typography variant="h4" sx={{ mb: 4 }}>
                Get in Touch
              </Typography>
              
              <Grid container spacing={3}>
                {[
                  {
                    icon: <LocationOnIcon sx={{ fontSize: 24 }} />,
                    title: 'Location',
                    content: 'Buda, Texas',
                  },
                  {
                    icon: <PhoneIcon sx={{ fontSize: 24 }} />,
                    title: 'Phone',
                    content: '(512) 797-2008',
                    link: 'tel:+15127972008',
                  },
                  {
                    icon: <EmailIcon sx={{ fontSize: 24 }} />,
                    title: 'Email',
                    content: 'contact@budafuldoordesigns.com',
                    link: 'mailto:contact@budafuldoordesigns.com',
                  },
                  {
                    icon: <AccessTimeIcon sx={{ fontSize: 24 }} />,
                    title: 'Response Time',
                    content: 'Within 24-48 hours',
                  },
                ].map((item, index) => (
                  <Grid item xs={12} key={index}>
                    <Card 
                      sx={{ 
                        bgcolor: 'background.paper',
                        transition: 'all 0.3s ease',
                        border: `1px solid ${alpha('#87A878', 0.1)}`,
                        boxShadow: `0 8px 24px ${alpha('#000', 0.05)}`,
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 12px 32px ${alpha('#000', 0.1)}`,
                          borderColor: alpha('#87A878', 0.2),
                        },
                      }}
                    >
                      <CardContent sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 2,
                      }}>
                        <Box sx={{ 
                          color: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                        }}>
                          {item.icon}
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {item.title}
                          </Typography>
                          {item.link ? (
                            <Typography 
                              component="a"
                              href={item.link}
                              sx={{ 
                                color: 'text.secondary',
                                textDecoration: 'none',
                                '&:hover': { color: 'primary.main' },
                              }}
                            >
                              {item.content}
                            </Typography>
                          ) : (
                            <Typography color="text.secondary">
                              {item.content}
                            </Typography>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={8}>
            <Card sx={{ 
              p: { xs: 2, md: 4 },
              '&:hover': {
                boxShadow: 4,
              },
            }}>
              <CardContent>
                <Typography variant="h4" sx={{ mb: 4 }}>
                  Send me a Message
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'primary.main',
                              }
                            }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        select
                        label="Inquiry Type"
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                      >
                        {inquiryTypes.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        multiline
                        rows={4}
                        label="Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        sx={{ 
                          py: 1.5,
                          mt: 2,
                          bgcolor: 'primary.main',
                          borderRadius: '50px',
                          boxShadow: `0 4px 14px ${alpha('#87A878', 0.4)}`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                            transform: 'translateY(-2px)',
                            boxShadow: `0 6px 20px ${alpha('#87A878', 0.6)}`,
                          },
                        }}
                      >
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Success/Error Messages */}
      <Snackbar 
        open={showSuccess} 
        autoHideDuration={6000} 
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          Thank you for your message! I'll get back to you as soon as possible.
        </Alert>
      </Snackbar>

      <Snackbar 
        open={showError} 
        autoHideDuration={6000} 
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setShowError(false)}>
          Please fill in all required fields.
        </Alert>
      </Snackbar>
    </Box>
  );
}
