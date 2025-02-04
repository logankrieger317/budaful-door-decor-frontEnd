import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, CircularProgress, Typography } from "@mui/material";
import CategoryNav from "../components/CategoryNav";
import HeroSlider from "../components/HeroSlider";
import CategoryGrid from "../components/CategoryGrid";
import Features from "../components/Features";
import Newsletter from "../components/Newsletter";
import ProductCarousel from "../components/ProductCarousel";
import { useCategories } from "../hooks/useCategories";
import { productsApi } from "../api/products";
import { heroSlides } from "../constants/heroSlides";
import { useState, useEffect } from "react";
import { Product } from "../types";

// Use absolute path for public images
const fallbackImage = '/images/ScatteredRibbon.jpeg';

export default function Home(): JSX.Element {
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const fetchedProducts = await productsApi.getAllProducts();
        setProducts(fetchedProducts);
        setProductsError(null);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProductsError('Failed to load products');
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const featuredProducts = products?.slice(0, 8) || [];

  return (
    <Box>
      <HeroSlider slides={heroSlides} fallbackImage={fallbackImage} />
      <CategoryNav />
      {categoriesLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : categoriesError ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <Typography color="error">{categoriesError}</Typography>
        </Box>
      ) : (
        <CategoryGrid categories={categories} />
      )}
      <Features />
      {!productsLoading && !productsError && featuredProducts.length > 0 && (
        <ProductCarousel products={featuredProducts} />
      )}
      <Newsletter />
    </Box>
  );
}
