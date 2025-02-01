import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box, 
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  ShoppingCart as ShoppingCartIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../store';
import { toggleCart } from '../store/cartSlice';
import { useSelector } from 'react-redux';

export default function Header(): JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'Products', path: '/products' },
    { text: 'About', path: '/about' },
    { text: 'Contact', path: '/contact' },
  ];

  const handleMenuClick = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMenuItemClick = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', py: { xs: 1, md: 2 } }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
            }}
          >
            Budaful Door Designs
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                onClick={() => handleMenuItemClick(item.path)}
                sx={{ 
                  fontWeight: 500,
                  color: 'primary.main',
                  '&:hover': {
                    color: 'primary.dark',
                  }
                }}
              >
                {item.text}
              </Button>
            ))}
            <IconButton
              onClick={() => dispatch(toggleCart())}
              sx={{ 
                ml: 2,
                color: 'primary.main',
                '&:hover': {
                  color: 'primary.dark',
                }
              }}
            >
              <ShoppingCartIcon />
              {itemCount > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: 12,
                  }}
                >
                  {itemCount}
                </Box>
              )}
            </IconButton>
          </Box>

          {/* Mobile Menu */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1, alignItems: 'center' }}>
            <IconButton
              onClick={() => dispatch(toggleCart())}
              sx={{ 
                color: 'primary.main',
                '&:hover': {
                  color: 'primary.dark',
                }
              }}
            >
              <ShoppingCartIcon />
              {itemCount > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: 12,
                  }}
                >
                  {itemCount}
                </Box>
              )}
            </IconButton>
            <IconButton
              edge="end"
              onClick={handleMenuClick}
              sx={{ 
                color: 'primary.main',
                '&:hover': {
                  color: 'primary.dark',
                }
              }}
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={isMobile && mobileMenuOpen}
        onClose={handleMenuClick}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 240,
            bgcolor: 'background.paper'
          },
        }}
      >
        <Box sx={{ pt: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem 
                key={item.text}
                onClick={() => handleMenuItemClick(item.path)}
                sx={{ 
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    color: 'primary.dark',
                  }
                }}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
