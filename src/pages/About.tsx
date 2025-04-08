import { Container, Typography, Box, useTheme, alpha } from '@mui/material';

export default function About(): JSX.Element {
  const theme = useTheme();
  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          position: 'relative',
          color: theme.palette.primary.main,
          py: { xs: 6, md: 10 },
          mb: { xs: 4, md: 8 },
          background: alpha(theme.palette.primary.light, 0.1),
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.2)}, ${alpha(theme.palette.primary.main, 0.1)})`,
            zIndex: -1,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60px',
            background: `linear-gradient(to top, ${alpha(theme.palette.background.default, 1)}, transparent)`,
            zIndex: -1,
          }
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 2,
              textAlign: 'center',
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
              letterSpacing: '0.5px',
              position: 'relative',
              color: theme.palette.primary.main,
              '&::after': {
                content: '""',
                display: 'block',
                width: '120px',
                height: '3px',
                background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                margin: '20px auto 0',
                borderRadius: '2px',
                opacity: 0.8,
              }
            }}
          >
            About Me
          </Typography>
        </Container>
      </Box>

      {/* Content Section */}
      <Container maxWidth="md">
        <Box sx={{ 
          mb: 6,
          position: 'relative',
          p: 4,
          borderRadius: '24px',
          background: alpha(theme.palette.primary.light, 0.03),
          boxShadow: `0 10px 30px ${alpha(theme.palette.primary.main, 0.05)}`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'center', md: 'flex-start' },
          gap: 4,
        }}>
          {/* Photo/Avatar Section */}
          <Box
            sx={{
              width: { xs: '200px', md: '300px' },
              flexShrink: 0,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '5%',
                left: '5%',
                right: '-5%',
                bottom: '-5%',
                border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: '50%',
                zIndex: 0,
              }
            }}
          >
            <Box
              component="img"
              src="/path/to/your/photo.jpg" // You'll need to replace this with your actual photo path
              alt="Shop Owner"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%',
                border: `4px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                position: 'relative',
                zIndex: 1,
              }}
            />
          </Box>

          {/* Text Content Section */}
          <Box sx={{ flex: 1, maxWidth: { xs: '100%', md: '60%' } }}>
            <Typography 
              variant="h5" 
              component="p" 
              sx={{ 
                mb: 3, 
                fontWeight: 500,
                fontFamily: '"Playfair Display", serif',
                color: theme.palette.primary.main,
                fontSize: '1.8rem',
                textAlign: { xs: 'center', md: 'left' },
                '&::after': {
                  content: '""',
                  display: 'block',
                  width: '60px',
                  height: '2px',
                  background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                  margin: { xs: '15px auto', md: '15px 0' },
                  borderRadius: '2px',
                }
              }}>
            Hi! Thanks for shopping with me. I am glad you're here!
          </Typography>
          
            <Typography 
              paragraph 
              sx={{ 
                mb: 3,
                lineHeight: 1.8,
                color: alpha(theme.palette.text.primary, 0.85),
                fontSize: '1.1rem',
                textAlign: { xs: 'center', md: 'left' },
              }}>
            My husband and I have lived in Buda since 1999 and have raised our family here. We have three adult children - an athlete son attending college in San Antonio, a daughter that lives close by and our son and daughter in law who live in a neighboring county with our grandbaby. I have always had a passion for crafting and enjoy seeing the smiles on my customer's faces. I understand the need to have access to quality supplies. Because of that I will always strive to provide you with a wide range of products for all of your needs!
          </Typography>

            <Typography 
              paragraph 
              sx={{ 
                mb: 3,
                lineHeight: 1.8,
                color: alpha(theme.palette.text.primary, 0.85),
                fontSize: '1.1rem',
                textAlign: { xs: 'center', md: 'left' },
              }}>
            Whether you are looking for quality supplies for homecoming, wreath making, crafting or gift giving or if you are needing custom made items....I am here to help!
          </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
