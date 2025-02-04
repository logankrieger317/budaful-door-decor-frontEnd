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
        <Typography variant="subtitle2" gutterBottom>
          Price Range
        </Typography>
        <Slider
          value={filters.priceRange}
          onChange={(_, value) => handleFilterChange("priceRange", value)}
          valueLabelDisplay="auto"
          min={0}
          max={maxPrice}
          valueLabelFormat={(value) => `$${value}`}
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

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              color: "text.primary",
            }}
          >
            {categoryName}
          </Typography>

          {/* Sort and Filter Controls */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                label="Sort By"
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
                variant="outlined"
              >
                Filters
              </Button>
            )}
          </Box>
        </Box>

        <Grid container spacing={2}>
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
              <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                {filteredProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product.sku}>
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
