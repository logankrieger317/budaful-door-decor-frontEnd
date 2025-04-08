import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  useTheme,
  useMediaQuery,
  alpha,
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
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: { xs: 4, sm: 6, md: 8 },
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(120deg, ${alpha(theme.palette.primary.light, 0.05)}, ${alpha(theme.palette.primary.main, 0.05)})`,
          zIndex: -1,
        }
      }}>
      <Typography
        variant="h3"
        sx={{
          mb: { xs: 3, sm: 4 },
          textAlign: "center",
          fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
          fontFamily: '"Playfair Display", serif',
          fontWeight: 600,
          color: theme.palette.primary.main,
          position: 'relative',
          '&::after': {
            content: '""',
            display: 'block',
            width: '60px',
            height: '2px',
            background: theme.palette.primary.main,
            margin: '15px auto 0',
            borderRadius: '2px',
          }
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
                transition: "all 0.3s ease-in-out",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.98)})`,
                backdropFilter: "blur(10px)",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: `0 12px 30px ${alpha(theme.palette.primary.main, 0.2)}`,
                  '& .category-image': {
                    transform: 'scale(1.1)',
                  }
                },
              }}
            >
              <CardMedia
                component="img"
                height={isMobile ? "160" : isTablet ? "180" : "220"}
                image={category.image}
                alt={category.name}
                className="category-image"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = "";
                  img.onerror = null; // Prevent infinite loop
                }}
                sx={{
                  objectFit: "cover",
                  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
              <CardContent sx={{
                p: 2.5,
                background: `linear-gradient(to top, ${alpha(theme.palette.primary.main, 0.05)}, transparent)`,
              }}>
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: "center",
                    color: theme.palette.primary.main,
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                    fontWeight: 500,
                    letterSpacing: '0.5px',
                    fontFamily: '"Playfair Display", serif',
                  }}
                >
                {category.name}
              </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
