import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import SEO from "../components/SEO";
import { productsApi } from "../api/products";
import { Product } from "../types";

const categories = [
  { id: 'wired-ribbon', name: 'Wired Ribbons' },
  { id: 'velvet-ribbon', name: 'Velvet Ribbons' },
  { id: 'embossed-ribbon', name: 'Embossed Ribbons' },
  { id: 'diamond-dust-ribbon', name: 'Diamond Dust Ribbons' },
  { id: 'satin-ribbon', name: 'Satin Ribbons' },
  { id: 'acetate-ribbon', name: 'Acetate Ribbons' },
];

export default function Products(): JSX.Element {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentCategory = categoryId || "all";
  
  const categoryName = categories.find((cat) => cat.id === currentCategory)?.name || "All Products";
  const pageTitle = `${categoryName} - Budaful Door Designs`;
  const pageDescription = `Shop our selection of ${categoryName.toLowerCase()}. Find premium quality ribbons and door decorations for your creative projects.`;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        let fetchedProducts: Product[];
        if (currentCategory === "all") {
          fetchedProducts = await productsApi.getAllProducts();
        } else {
          fetchedProducts = await productsApi.getProductsByCategory(currentCategory);
        }

        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategory]);

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
        title={pageTitle}
        description={pageDescription}
        keywords={`${categoryName.toLowerCase()}, door decorations, ribbons, crafting supplies`}
      />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4 }}>
          <Link color="inherit" href="/">
            Home
          </Link>
          <Typography color="text.primary">
            {categoryName}
          </Typography>
        </Breadcrumbs>

        <Typography
          variant="h4"
          component="h1"
          sx={{
            mb: 4,
            fontWeight: "bold",
            color: "text.primary",
          }}
        >
          {categoryName}
        </Typography>

        {products.length === 0 ? (
          <Typography variant="body1" textAlign="center" color="text.secondary">
            No products found in this category.
          </Typography>
        ) : (
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.sku}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
