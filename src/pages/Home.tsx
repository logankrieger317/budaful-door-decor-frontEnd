import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, CircularProgress, Typography } from "@mui/material";
import CategoryNav from "../components/CategoryNav";
import HeroSlider from "../components/HeroSlider";
import CategoryGrid from "../components/CategoryGrid";
import Features from "../components/Features";
import Newsletter from "../components/Newsletter";
import { useCategories } from "../hooks/useCategories";
import { heroSlides } from "../constants/heroSlides";

// Use absolute path for public images
const fallbackImage = '/images/ScatteredRibbon.jpeg';

export default function Home(): JSX.Element {
  const { categories, loading, error } = useCategories();

  return (
    <Box>
      <HeroSlider slides={heroSlides} fallbackImage={fallbackImage} />
      <CategoryNav />
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <CategoryGrid categories={categories} />
      )}
      <Features />
      <Newsletter />
    </Box>
  );
}
