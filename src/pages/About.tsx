import { Container, Typography, Box } from '@mui/material';

export default function About(): JSX.Element {
  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 6, md: 10 },
          mb: { xs: 4, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 2,
              textAlign: 'center',
            }}
          >
            About Me
          </Typography>
        </Container>
      </Box>

      {/* Content Section */}
      <Container maxWidth="md">
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" component="p" sx={{ mb: 3, fontWeight: 'medium' }}>
            Hi! Thanks for shopping with me. I am glad you're here!
          </Typography>
          
          <Typography paragraph sx={{ mb: 3 }}>
            My husband and I have lived in Buda since 1999 and have raised our family here. We have three adult children - an athlete son attending college in San Antonio, a daughter that lives close by and our son and daughter in law who live in a neighboring county with our grandbaby. I have always had a passion for crafting and enjoy seeing the smiles on my customer's faces. I understand the need to have access to quality supplies. Because of that I will always strive to provide you with a wide range of products for all of your needs!
          </Typography>

          <Typography paragraph sx={{ mb: 3 }}>
            Whether you are looking for quality supplies for homecoming, wreath making, crafting or gift giving or if you are needing custom made items....I am here to help!
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
