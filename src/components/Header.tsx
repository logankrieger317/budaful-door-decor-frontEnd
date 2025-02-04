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
  useMediaQuery,
  Badge
} from '@mui/material';
import { 
  ShoppingCart as ShoppingCartIcon,
  Menu as MenuIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../store';
import { toggleCart } from '../store/cartSlice';
import { useSelector } from 'react-redux';
import LoginDialog from './LoginDialog'; // Assuming LoginDialog is a separate component

export default function Header(): JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const user = useSelector((state: RootState) => state.user.currentUser);

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

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile ? (
              <>
                <IconButton
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMenuClick}
                  sx={{ mr: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.text}
                    color="inherit"
                    onClick={() => handleMenuItemClick(item.path)}
                    sx={{ mx: 1 }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
              {user ? (
                <Button
                  color="inherit"
                  startIcon={<PersonIcon />}
                  onClick={() => navigate('/profile')}
                  sx={{ mr: 2 }}
                >
                  {user.firstName}
                </Button>
              ) : (
                <Button
                  color="inherit"
                  startIcon={<PersonIcon />}
                  onClick={() => setLoginDialogOpen(true)}
                  sx={{ mr: 2 }}
                >
                  Login
                </Button>
              )}
              <IconButton
                color="inherit"
                aria-label="cart"
                onClick={() => dispatch(toggleCart())}
              >
                <Badge badgeContent={itemCount} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Box>
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

      <LoginDialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
      />
    </AppBar>
  );
}
