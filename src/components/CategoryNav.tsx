import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, useTheme, useMediaQuery, Menu, MenuItem, Tabs, Tab } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export const categories = [
  { id: 'wired-ribbon', name: 'Wired Ribbons' },
  { id: 'velvet-ribbon', name: 'Velvet Ribbons' },
  { id: 'embossed-ribbon', name: 'Embossed Ribbons' },
  { id: 'diamond-dust-ribbon', name: 'Diamond Dust Ribbons' },
  { id: 'satin-ribbon', name: 'Satin Ribbons' },
  { id: 'acetate-ribbon', name: 'Acetate Ribbons' },
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
          <Toolbar disableGutters>
            <Button
              onClick={handleMobileMenuClick}
              endIcon={<KeyboardArrowDownIcon />}
              sx={{ color: 'text.primary' }}
            >
              {currentCategory === 'all' 
                ? 'All Categories'
                : categories.find(cat => cat.id === currentCategory)?.name || 'All Categories'}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMobileMenuClose}
            >
              <MenuItem 
                onClick={() => handleCategoryClick('all')}
                selected={currentCategory === 'all'}
              >
                All Categories
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
        <Toolbar disableGutters sx={{ overflowX: 'auto' }}>
          <Tabs 
            value={currentCategory} 
            onChange={(_, value) => handleCategoryClick(value)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                minWidth: 'auto',
                px: 3,
              }
            }}
          >
            <Tab 
              label="All Categories"
              value="all"
            />
            {categories.map((category) => (
              <Tab
                key={category.id}
                label={category.name}
                value={category.id}
              />
            ))}
          </Tabs>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
