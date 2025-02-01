import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { Box, Typography, Button, useTheme, useMediaQuery } from '@mui/material';

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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: !isMobile,
    adaptiveHeight: true,
  };

  return (
    <Box sx={{ 
      position: 'relative',
      width: '100%',
      height: { xs: '400px', sm: '500px', md: '600px' },
      overflow: 'hidden'
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
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                p: { xs: 2, sm: 3, md: 4 },
              }}
            >
              <Typography 
                variant="h2" 
                sx={{ 
                  mb: { xs: 1, sm: 2 },
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                  fontWeight: 700,
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
                  textTransform: 'none'
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
