import { Container, Typography, Grid, Box, useTheme, alpha } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HighQualityIcon from '@mui/icons-material/HighQuality';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <HighQualityIcon sx={{ fontSize: 40 }} />,
    title: 'Quality Materials',
    description: 'We use only the best materials for our products.',
  },
  {
    icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
    title: 'Fast Shipping',
    description: 'Quick and reliable shipping on all orders.',
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
    title: 'Customer Support',
    description: 'Friendly and helpful support team.',
  },
];

export default function Features(): JSX.Element {
  const theme = useTheme();
  return (
    <Box sx={{ 
      position: 'relative',
      py: { xs: 4, sm: 6, md: 8 },
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
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography 
          variant="h2" 
          sx={{ 
            textAlign: 'center', 
            mb: { xs: 3, sm: 4, md: 6 },
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
          Why Choose Us
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box 
                sx={{ 
                  bgcolor: 'background.paper',
                  p: 4, 
                  borderRadius: '16px',
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
                  textAlign: 'center',
                  height: '100%',
                  transition: 'all 0.3s ease-in-out',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                    opacity: 0,
                    transition: 'opacity 0.3s ease-in-out',
                  },
                  '&:hover': { 
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 30px ${alpha(theme.palette.primary.main, 0.2)}`,
                    '&::before': {
                      opacity: 1,
                    },
                    '& .feature-icon': {
                      transform: 'scale(1.1) rotate(5deg)',
                    }
                  }
                }}
              >
                <Box 
                  className="feature-icon"
                  sx={{ 
                    color: theme.palette.primary.main,
                    mb: 2,
                    transition: 'transform 0.3s ease-in-out',
                    transform: 'scale(1) rotate(0deg)',
                  }}>
                  {feature.icon}
                </Box>
                <Typography 
                  variant="h5" 
                  component="h3" 
                  sx={{ 
                    mb: 2,
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                  }}>
                  {feature.title}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: alpha(theme.palette.text.primary, 0.7),
                    lineHeight: 1.6,
                    letterSpacing: '0.3px'
                  }}>
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
