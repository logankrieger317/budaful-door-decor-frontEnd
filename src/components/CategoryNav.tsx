import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, useTheme, useMediaQuery, Menu, MenuItem, Tabs, Tab } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export const categories = [
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
      navigate(`/category/${categoryId}`);
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
              <MenuItem
                key="all"
                onClick={() => handleCategoryClick('all')}
                selected={currentCategory === 'all'}
              >
                All Products
              </MenuItem>
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
          <Tabs
            value={currentCategory}
            onChange={(_, newValue) => {
              if (newValue === 'all') {
                navigate('/products');
              } else {
                navigate(`/category/${newValue}`);
              }
            }}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Product Categories"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                minWidth: 'auto',
                px: 3,
              },
            }}
          >
            <Tab
              label="All Products"
              value="all"
              sx={{
                color: currentCategory === 'all' ? 'primary.main' : 'text.primary',
              }}
            />
            {categories.map((category) => (
              <Tab
                key={category.id}
                label={category.name}
                value={category.id}
                sx={{
                  color: currentCategory === category.id ? 'primary.main' : 'text.primary',
                }}
              />
            ))}
          </Tabs>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
