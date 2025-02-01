import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, useTheme, useMediaQuery, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'seasonal', name: 'Seasonal' },
  { id: 'florals', name: 'Florals' },
  { id: 'greenery', name: 'Greenery' },
  { id: 'ribbons', name: 'Ribbons' },
  { id: 'containers', name: 'Containers' },
  { id: 'custom', name: 'Custom Orders' },
];

export default function CategoryNav(): JSX.Element {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const currentCategory = searchParams.get('category') || 'all';

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'all') {
      navigate('/products');
    } else {
      navigate(`/products?category=${categoryId}`);
    }
    setAnchorEl(null);
  };

  const handleMobileMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setAnchorEl(null);
  };

  if (isMobile) {
    return (
      <AppBar 
        position="sticky" 
        color="default" 
        elevation={0}
        sx={{ 
          top: 64,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'center' }}>
            <Button
              onClick={handleMobileMenuClick}
              endIcon={<KeyboardArrowDownIcon />}
              sx={{ color: 'text.primary' }}
            >
              {categories.find(cat => cat.id === currentCategory)?.name || 'All Products'}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMobileMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              {categories.map((category) => (
                <MenuItem
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  selected={currentCategory === category.id}
                >
                  {category.name}
                </MenuItem>
              ))}
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>
    );
  }

  return (
    <AppBar 
      position="sticky" 
      color="default" 
      elevation={0}
      sx={{ 
        top: 64,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'center', gap: 2 }}>
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              sx={{
                color: currentCategory === category.id ? 'primary.main' : 'text.primary',
                borderBottom: currentCategory === category.id ? 2 : 0,
                borderColor: 'primary.main',
                borderRadius: 0,
                px: 2,
                '&:hover': {
                  borderBottom: 2,
                  backgroundColor: 'transparent',
                },
              }}
            >
              {category.name}
            </Button>
          ))}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
