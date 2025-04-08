import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { Box, Typography, Button, useTheme, useMediaQuery, alpha } from '@mui/material';
import { keyframes } from '@mui/system';

interface Slide {
  image: string;
  title: string;
  subtitle: string;
}

interface HeroSliderProps {
  slides: Slide[];
  fallbackImage: string;
}

export default function HeroSlider({ slides, fallbackImage }: HeroSliderProps): JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fadeIn = keyframes`
    from { opacity: 0; transform: scale(1.02); }
    to { opacity: 1; transform: scale(1); }
  `;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    arrows: !isMobile,
    adaptiveHeight: true,
    fade: true,
    cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
  };

  return (
    <Box sx={{ 
      position: 'relative',
      width: '100%',
      height: { xs: '400px', sm: '500px', md: '600px' },
      overflow: 'hidden',
      borderRadius: { xs: '0', sm: '16px' },
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      my: { xs: 0, sm: 2 },
      mx: 'auto',
      maxWidth: '1600px'
    }}>
      <Slider {...sliderSettings}>
        {slides.map((slide, index) => (
          <Box key={index} sx={{ position: 'relative', height: { xs: '400px', sm: '500px', md: '600px' } }}>
            <Box
              component="img"
              src={slide.image}
              alt={slide.title}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.src = fallbackImage;
              }}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                animation: `${fadeIn} 1s ease-out`,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                background: `linear-gradient(to bottom, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.primary.main, 0.6)})`,
                backdropFilter: 'blur(2px)',
                color: 'white',
                p: { xs: 2, sm: 3, md: 4 },
              }}
            >
              <Typography 
                variant="h2" 
                sx={{ 
                  mb: { xs: 1, sm: 2 },
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                  fontWeight: 600,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  letterSpacing: '0.5px',
                  fontFamily: '"Playfair Display", serif',
                }}
              >
                {slide.title}
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: { xs: 2, sm: 3, md: 4 },
                  fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                }}
              >
                {slide.subtitle}
              </Typography>
              <Button
                component={Link}
                to="/products"
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  mt: 4,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  borderRadius: '50px',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                  }
                }}
              >
                Shop Now
              </Button>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
