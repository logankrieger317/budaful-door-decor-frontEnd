import { Container, Typography, Grid, Box } from '@mui/material';
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
  return (
    <Box sx={{ bgcolor: 'grey.50', py: { xs: 4, sm: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h2" 
          sx={{ 
            textAlign: 'center', 
            mb: { xs: 3, sm: 4, md: 6 },
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
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
                  borderRadius: 1,
                  boxShadow: 1,
                  textAlign: 'center',
                  height: '100%',
                  transition: 'box-shadow 0.3s ease-in-out',
                  '&:hover': { 
                    boxShadow: 3,
                  }
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h3" sx={{ mb: 2 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
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
