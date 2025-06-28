import { useState } from "react";
import { alpha } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../store/userSlice";
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
  Badge,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { RootState, AppDispatch } from "../store";
import { toggleCart } from "../store/cartSlice";
import LoginDialog from "./LoginDialog"; // Assuming LoginDialog is a separate component

export default function Header(): JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const user = useSelector((state: RootState) => state.user.currentUser);

  const menuItems = [
    { text: "Home", path: "/" },
    { text: "Products", path: "/products" },
    { text: "About", path: "/about" },
    { text: "Contact", path: "/contact" },
  ];

  const handleMenuClick = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMenuItemClick = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    // Clear user from Redux store
    dispatch(clearUser());
    // Remove token from localStorage
    localStorage.removeItem("token");
    // Navigate to home page
    navigate("/");
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        bgcolor: "background.paper",
        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
      }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: "space-between", py: { xs: 1, md: 2 } }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              color: theme.palette.primary.main,
              textDecoration: "none",
              fontWeight: 600,
              fontSize: { xs: "1.2rem", md: "1.5rem" },
              fontFamily: '"Playfair Display", serif',
              letterSpacing: "0.5px",
              transition: "color 0.3s ease",
              '&:hover': {
                color: alpha(theme.palette.primary.main, 0.8),
              }
            }}
          >
            Budaful Door Designs
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isMobile ? (
              <>
                <IconButton
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMenuClick}
                  sx={{ mr: 1, color: "text.primary" }}
                >
                  <MenuIcon />
                </IconButton>
              </>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.text}
                    onClick={() => handleMenuItemClick(item.path)}
                    sx={{
                      mx: 1.5,
                      color: "text.primary",
                      fontWeight: 500,
                      position: "relative",
                      '&::after': {
                        content: '""',
                        position: "absolute",
                        bottom: -2,
                        left: "50%",
                        width: 0,
                        height: "2px",
                        background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                        transition: "all 0.3s ease",
                        transform: "translateX(-50%)",
                        opacity: 0,
                        borderRadius: "2px",
                      },
                      "&:hover": {
                        color: theme.palette.primary.main,
                        '&::after': {
                          width: "80%",
                          opacity: 1,
                        }
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            )}

            <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
              {user ? (
                <>
                  {user.isAdmin && (
                    <Button
                      onClick={() => navigate("/admin/dashboard")}
                      sx={{
                        mx: 1,
                        color: theme.palette.primary.main,
                        borderColor: alpha(theme.palette.primary.main, 0.5),
                        borderRadius: "50px",
                        padding: "6px 16px",
                        textTransform: "none",
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        transition: "all 0.3s ease",
                        background: alpha(theme.palette.primary.main, 0.02),
                        "&:hover": {
                          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.9)})`,
                          color: "white",
                          borderColor: "transparent",
                          transform: "translateY(-1px)",
                          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
                        },
                        variant: "outlined",
                      }}
                    >
                      Admin Dashboard
                    </Button>
                  )}
                  <Button
                    onClick={() => navigate("/profile")}
                    sx={{
                      mx: 1,
                      color: "primary.main",
                      borderColor: "primary.main",
                      borderRadius: "50px",
                      padding: "6px 16px",
                      textTransform: "none",
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      background: alpha(theme.palette.primary.main, 0.05),
                      "&:hover": {
                        backgroundColor: "primary.main",
                        color: "white",
                        transform: "translateY(-1px)",
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
                      },
                      variant: "outlined",
                    }}
                  >
                    My Dashboard
                  </Button>
                  <Button
                    onClick={handleLogout}
                    sx={{
                      mx: 1,
                      color: "error.main",
                      borderColor: "error.main",
                      "&:hover": {
                        backgroundColor: "error.main",
                        color: "white",
                      },
                      variant: "outlined",
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  startIcon={<PersonIcon />}
                  onClick={() => setLoginDialogOpen(true)}
                  sx={{
                    mx: 1,
                    color: "primary.main",
                    borderColor: "primary.main",
                    "&:hover": {
                      backgroundColor: "primary.main",
                      color: "white",
                    },
                    variant: "outlined",
                  }}
                >
                  Login
                </Button>
              )}
              <IconButton
                aria-label="cart"
                onClick={() => dispatch(toggleCart())}
                sx={{
                  color: "text.primary",
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
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
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 240,
            bgcolor: "background.paper",
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
                  color: "text.primary",
                  borderRadius: "12px",
                  mx: 1,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: alpha(theme.palette.primary.main, 0.08),
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            
            {/* User Account Section in Mobile Menu */}
            {user ? (
              <>
                <ListItem
                  onClick={() => handleMenuItemClick("/profile")}
                  sx={{
                    color: theme.palette.primary.main,
                    borderRadius: "12px",
                    mx: 1,
                    mt: 2,
                    background: alpha(theme.palette.primary.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <ListItemText 
                    primary="My Dashboard" 
                    secondary={`Welcome, ${user.firstName}!`}
                  />
                </ListItem>
                {user.isAdmin && (
                  <ListItem
                    onClick={() => handleMenuItemClick("/admin/dashboard")}
                    sx={{
                      color: "text.primary",
                      borderRadius: "12px",
                      mx: 1,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: alpha(theme.palette.primary.main, 0.08),
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    <ListItemText primary="Admin Dashboard" />
                  </ListItem>
                )}
                <ListItem
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  sx={{
                    color: "error.main",
                    borderRadius: "12px",
                    mx: 1,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: alpha(theme.palette.error.main, 0.08),
                    },
                  }}
                >
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            ) : (
              <ListItem
                onClick={() => {
                  setMobileMenuOpen(false);
                  setLoginDialogOpen(true);
                }}
                sx={{
                  color: theme.palette.primary.main,
                  borderRadius: "12px",
                  mx: 1,
                  mt: 2,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: theme.palette.primary.main,
                    color: "white",
                  },
                }}
              >
                <ListItemText primary="Login / Register" />
              </ListItem>
            )}
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
