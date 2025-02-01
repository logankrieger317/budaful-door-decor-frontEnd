import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  useTheme,
  useMediaQuery,
} from "@mui/material";

interface Category {
  name: string;
  image: string;
  link: string;
}

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({
  categories,
}: CategoryGridProps): JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
      <Typography
        variant="h3"
        sx={{
          mb: { xs: 3, sm: 4 },
          textAlign: "center",
          fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
        }}
      >
        Shop by Category
      </Typography>
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {categories.map((category, index) => (
          <Grid item xs={6} sm={6} md={3} key={index}>
            <Card
              component={Link}
              to={category.link}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                textDecoration: "none",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <CardMedia
                component="img"
                height={isMobile ? "140" : isTablet ? "160" : "200"}
                image={category.image}
                alt={category.name}
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = "";
                  img.onerror = null; // Prevent infinite loop
                }}
                sx={{
                  objectFit: "cover",
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  p: 2,
                  textAlign: "center",
                  color: "text.primary",
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                }}
              >
                {category.name}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
