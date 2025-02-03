import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  CircularProgress,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { productsApi } from "../api/products";
import { Product } from "../types";
import { addItem } from "../store/cartSlice";
import SEO from "../components/SEO";

export default function ProductDetail(): JSX.Element {
  const { sku } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const products = await productsApi.getAllProducts();
        const foundProduct = products.find((p) => p.sku === sku);

        if (!foundProduct) {
          setError("Product not found");
          return;
        }

        setProduct(foundProduct);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (sku) {
      fetchProduct();
    }
  }, [sku]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addItem({
          ...product,
          quantity: 1,
        })
      );
    }
  };

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

  if (error || !product) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Typography color="error">{error || "Product not found"}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <SEO
        title={`${product.name} - Budaful Door Designs`}
        description={product.description}
        keywords={`${product.name}, ${product.category}, door decorations, ribbons`}
      />

      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link color="inherit" href="/">
          Home
        </Link>
        <Link color="inherit" href={`/category/${product.category}`}>
          {product.category
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={product.imageUrl || ""}
            alt={product.name}
            sx={{
              width: "100%",
              height: "auto",
              borderRadius: 2,
              boxShadow: 1,
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            SKU: {product.sku}
          </Typography>

          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>

          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Specifications:
            </Typography>
            <Typography>
              Size: {product.width}" x {product.length}"
            </Typography>
            <Typography>Color: {product.color}</Typography>
            {product.brand && <Typography>Brand: {product.brand}</Typography>}
            <Typography>{product.isWired ? "Wired" : "Not Wired"}</Typography>
          </Box>

          <Typography variant="h5" color="primary" sx={{ my: 2 }}>
            ${product.price.toFixed(2)}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleAddToCart}
            sx={{ mt: 2 }}
          >
            Add to Cart
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
