import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';
import { Product, CartItem } from '../types';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { ChevronLeft, ChevronRight, Close as CloseIcon } from '@mui/icons-material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface ProductCarouselProps {
  products: Product[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [options, setOptions] = React.useState<{ quantity: number }>({
    quantity: 1,
  });

  const handleBuyNow = (product: Product) => {
    const cartItem: CartItem = {
      ...product,
      quantity: 1,
    };
    dispatch(addItem(cartItem));
    navigate('/checkout');
  };

  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product);
    setOptions({ quantity: 1 });
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setOptions({ quantity: 1 });
  };

  const handleConfirmAddToCart = () => {
    if (selectedProduct) {
      const cartItem: CartItem = {
        ...selectedProduct,
        quantity: options.quantity,
      };
      dispatch(addItem(cartItem));
      handleCloseModal();
    }
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (selectedProduct && newQuantity > 0 && newQuantity <= selectedProduct.quantity) {
      setOptions(prev => ({
        ...prev,
        quantity: newQuantity,
      }));
    }
  };

  const CustomPrevArrow = (props: any) => (
    <IconButton
      {...props}
      sx={{
        position: 'absolute',
        left: '-40px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        color: 'primary.main',
        '&:hover': {
          color: 'primary.dark',
        },
        display: { xs: 'none', md: 'flex' },
      }}
    >
      <ChevronLeft />
    </IconButton>
  );

  const CustomNextArrow = (props: any) => (
    <IconButton
      {...props}
      sx={{
        position: 'absolute',
        right: '-40px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        color: 'primary.main',
        '&:hover': {
          color: 'primary.dark',
        },
        display: { xs: 'none', md: 'flex' },
      }}
    >
      <ChevronRight />
    </IconButton>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : isTablet ? 2 : 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h2"
        align="center"
        gutterBottom
        sx={{ mb: 4 }}
      >
        Featured Products
      </Typography>
      <Box sx={{ mx: { md: 5 } }}>
        <Slider {...settings}>
          {products.map((product) => (
            <Box key={product.sku} sx={{ px: 2 }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height={200}
                  image={product.imageUrl || '/images/placeholderImage.jpeg'}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3">
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                    ${product.price.toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0, gap: 1, flexDirection: { xs: 'column', sm: 'row' }, minHeight: 80 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleBuyNow(product)}
                    sx={{ flex: 1, width: '100%' }}
                  >
                    Buy Now
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleAddToCart(product)}
                    sx={{ flex: 1, width: '100%' }}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Slider>
      </Box>

      <Modal
        open={Boolean(selectedProduct)}
        onClose={handleCloseModal}
        aria-labelledby="add-to-cart-modal"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 },
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" component="h2" gutterBottom>
            Add to Cart
          </Typography>

          {selectedProduct && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  {selectedProduct.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ${selectedProduct.price.toFixed(2)}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="quantity-label">Quantity</InputLabel>
                  <Select
                    labelId="quantity-label"
                    value={options.quantity}
                    label="Quantity"
                    onChange={(e) => handleUpdateQuantity(Number(e.target.value))}
                  >
                    {[...Array(selectedProduct.quantity)].map((_, i) => (
                      <MenuItem key={i + 1} value={i + 1}>
                        {i + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleConfirmAddToCart}
                >
                  Add to Cart
                </Button>
              </Grid>
            </Grid>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default ProductCarousel;
