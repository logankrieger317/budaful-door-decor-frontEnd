import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  // TextField,
  Slider,
  Drawer,
  IconButton,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  Divider,
  alpha,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import SEO from "../components/SEO";
import { productsApi } from "../api/products";
import { Product } from "../types";

type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc";

interface FilterState {
  priceRange: [number, number];
  colors: string[];
  brands: string[];
  widthRange: [number, number];
  lengthRange: [number, number];
  isWired?: boolean;
}

const categories = [
  { id: "wired-ribbon", name: "Wired Ribbons" },
  { id: "velvet-ribbon", name: "Velvet Ribbons" },
  { id: "embossed-ribbon", name: "Embossed Ribbons" },
  { id: "diamond-dust-ribbon", name: "Diamond Dust Ribbons" },
  { id: "satin-ribbon", name: "Satin Ribbons" },
  { id: "acetate-ribbon", name: "Acetate Ribbons" },
];

export default function Products(): JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { categoryId } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(!isMobile);
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    colors: [],
    brands: [],
    widthRange: [0, 100],
    lengthRange: [0, 100],
  });

  // Derived state for available filter options
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(1000);

  const currentCategory = categoryId || "all";
  const categoryName =
    categories.find((cat) => cat.id === currentCategory)?.name ||
    "All Products";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        let fetchedProducts: Product[];
        if (currentCategory === "all") {
          fetchedProducts = await productsApi.getAllProducts();
        } else {
          fetchedProducts = await productsApi.getProductsByCategory(
            currentCategory
          );
        }

        setProducts(fetchedProducts);

        // Update available filter options
        const colors = [...new Set(fetchedProducts.map((p) => p.color))];
        const brands = [...new Set(fetchedProducts.map((p) => p.brand))];
        const maxProductPrice = Math.max(
          ...fetchedProducts.map((p) => p.price)
        );

        setAvailableColors(colors);
        setAvailableBrands(brands);
        setMaxPrice(maxProductPrice);
        setFilters((prev) => ({
          ...prev,
          priceRange: [0, maxProductPrice],
        }));
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategory]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];

    // Apply filters
    result = result.filter((product) => {
      const matchesPrice =
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1];
      const matchesColor =
        filters.colors.length === 0 || filters.colors.includes(product.color);
      const matchesBrand =
        filters.brands.length === 0 || filters.brands.includes(product.brand);
      const matchesWidth =
        product.width >= filters.widthRange[0] &&
        product.width <= filters.widthRange[1];
      const matchesLength =
        product.length >= filters.lengthRange[0] &&
        product.length <= filters.lengthRange[1];
      const matchesWired =
        filters.isWired === undefined || product.isWired === filters.isWired;

      return (
        matchesPrice &&
        matchesColor &&
        matchesBrand &&
        matchesWidth &&
        matchesLength &&
        matchesWired
      );
    });

    // Apply sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    setFilteredProducts(result);
  }, [products, filters, sortOption]);

  const handleFilterChange = (filterName: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const renderFilterDrawer = () => (
    <Box
      sx={{
        width: isMobile ? "100%" : 280,
        p: 2,
        height: isMobile ? "auto" : "100%",
        overflow: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Filters</Typography>
        {isMobile && (
          <IconButton onClick={() => setIsFilterDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Price Range Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="subtitle2" 
          gutterBottom
          sx={{ 
            fontFamily: '"Playfair Display", serif',
            color: theme.palette.primary.main,
            fontSize: '1.1rem',
            mb: 2
          }}
        >
          Price Range
        </Typography>
        <Slider
          value={filters.priceRange}
          onChange={(_, value) => handleFilterChange("priceRange", value)}
          valueLabelDisplay="auto"
          min={0}
          max={maxPrice}
          valueLabelFormat={(value) => `$${value}`}
          sx={{
            color: theme.palette.primary.main,
            '& .MuiSlider-thumb': {
              '&:hover, &.Mui-focusVisible': {
                boxShadow: `0 0 0 8px ${alpha(theme.palette.primary.main, 0.16)}`,
              },
            },
            '& .MuiSlider-valueLabel': {
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              borderRadius: '8px',
              padding: '4px 8px',
              fontSize: '0.8rem',
            }
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="caption">${filters.priceRange[0]}</Typography>
          <Typography variant="caption">${filters.priceRange[1]}</Typography>
        </Box>
      </Box>

      {/* Color Filter */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Colors</InputLabel>
        <Select
          multiple
          value={filters.colors}
          onChange={(e) => handleFilterChange("colors", e.target.value)}
          sx={{
            borderRadius: '12px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(theme.palette.primary.main, 0.2),
              transition: 'border-color 0.3s ease-in-out',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(theme.palette.primary.main, 0.5),
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
            },
          }}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
            </Box>
          )}
        >
          {availableColors.map((color) => (
            <MenuItem key={color} value={color}>
              {color}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Brand Filter */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Brands</InputLabel>
        <Select
          multiple
          value={filters.brands}
          onChange={(e) => handleFilterChange("brands", e.target.value)}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
            </Box>
          )}
        >
          {availableBrands.map((brand) => (
            <MenuItem key={brand} value={brand}>
              {brand}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Wired Filter */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Wired</InputLabel>
        <Select
          value={filters.isWired === undefined ? "" : filters.isWired ? "true" : "false"}
          onChange={(e) => handleFilterChange("isWired", e.target.value === "" ? undefined : e.target.value === "true")}
        >
          <MenuItem value="">Any</MenuItem>
          <MenuItem value="true">Yes</MenuItem>
          <MenuItem value="false">No</MenuItem>
        </Select>
      </FormControl>

      {/* Reset Filters Button */}
      <Button
        fullWidth
        variant="outlined"
        onClick={() =>
          setFilters({
            priceRange: [0, maxPrice],
            colors: [],
            brands: [],
            widthRange: [0, 100],
            lengthRange: [0, 100],
          })
        }
        sx={{
          borderRadius: '50px',
          borderColor: alpha(theme.palette.primary.main, 0.3),
          color: theme.palette.primary.main,
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 500,
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: theme.palette.primary.main,
            background: alpha(theme.palette.primary.main, 0.05),
          }
        }}
      >
        Reset Filters
      </Button>
    </Box>
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <SEO
        title={`${categoryName} - Budaful Door Designs`}
        description={`Shop our selection of ${categoryName.toLowerCase()}. Find premium quality ribbons and door decorations for your creative projects.`}
        keywords={`${categoryName.toLowerCase()}, door decorations, ribbons, crafting supplies`}
      />

      <Container maxWidth="lg" sx={{ 
        py: 8,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)}, ${alpha(theme.palette.primary.main, 0.02)})`,
          zIndex: -1,
          borderRadius: '24px',
        }
      }}>
        <Box sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", md: "row" },
          gap: 2, 
          mb: 4 
        }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
              color: theme.palette.primary.main,
              mb: { xs: 2, md: 0 },
              fontFamily: '"Playfair Display", serif',
              position: 'relative',
              '&::after': {
                content: '""',
                display: 'block',
                width: '60px',
                height: '2px',
                background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                marginTop: '8px',
                borderRadius: '2px',
              }
            }}
          >
            {categoryName}
          </Typography>

          {/* Sort and Filter Controls */}
          <Box sx={{ 
            display: "flex", 
            gap: 2, 
            alignItems: "center",
            flexWrap: { xs: "wrap", md: "nowrap" },
            width: { xs: "100%", md: "auto" }
          }}>
            <FormControl sx={{ 
              minWidth: 200,
              width: { xs: "100%", sm: "auto" }
            }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                label="Sort By"
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                    transition: 'border-color 0.3s ease-in-out',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                  borderRadius: '12px',
                }}
              >
                <MenuItem value="name-asc">Name (A-Z)</MenuItem>
                <MenuItem value="name-desc">Name (Z-A)</MenuItem>
                <MenuItem value="price-asc">Price (Low to High)</MenuItem>
                <MenuItem value="price-desc">Price (High to Low)</MenuItem>
              </Select>
            </FormControl>

            {isMobile && (
              <Button
                startIcon={<FilterListIcon />}
                onClick={() => setIsFilterDrawerOpen(true)}
                variant="contained"
                sx={{ 
                  width: { xs: "100%", sm: "auto" },
                  borderRadius: '50px',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
                  transition: 'all 0.3s ease',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                  }
                }}
              >
                Filters
              </Button>
            )}
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Filter Sidebar */}
          {!isMobile && (
            <Grid item xs={12} md={3}>
              {renderFilterDrawer()}
            </Grid>
          )}

          {/* Product Grid */}
          <Grid item xs={12} md={!isMobile ? 9 : 12}>
            {filteredProducts.length === 0 ? (
              <Typography
                variant="body1"
                textAlign="center"
                color="text.secondary"
              >
                No products found matching your criteria.
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {filteredProducts.map((product, index) => (
                  <Grid item key={`product-grid-${product.sku}-${index}`} xs={12} sm={6} md={4} lg={3}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Mobile Filter Drawer */}
      {isMobile && (
        <Drawer
          anchor="right"
          open={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
        >
          {renderFilterDrawer()}
        </Drawer>
      )}
    </Box>
  );
}
