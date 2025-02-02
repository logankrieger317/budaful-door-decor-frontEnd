import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Link,
  useTheme,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

export default function Footer(): JSX.Element {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.primary.main,
        color: "white",
        py: { xs: 4, md: 6 },
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Social Media Links */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Connect With Us
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                component="a"
                href="https://facebook.com/budafuldoordesigns"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "white",
                  "&:hover": {
                    color: theme.palette.primary.light,
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://instagram.com/budafuldoordesigns"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "white",
                  "&:hover": {
                    color: theme.palette.primary.light,
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://pinterest.com/budafuldoordesigns"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "white",
                  "&:hover": {
                    color: theme.palette.primary.light,
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <PinterestIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Contact Us
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                href="tel:+1234567890"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "white",
                  textDecoration: "none",
                  "&:hover": { color: theme.palette.primary.light },
                }}
              >
                <PhoneIcon fontSize="small" />
                <Typography>(512) 797-2008</Typography>
              </Link>
              <Link
                href="mailto:contact@budafuldoordesigns.com"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "white",
                  textDecoration: "none",
                  "&:hover": { color: theme.palette.primary.light },
                }}
              >
                <EmailIcon fontSize="small" />
                <Typography>contact@budafuldoordesigns.com</Typography>
              </Link>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                href="#/"
                color="inherit"
                sx={{
                  display: "block",
                  mb: 1,
                  textDecoration: "none",
                  "&:hover": { color: "primary.main" },
                }}
              >
                Home
              </Link>
              <Link
                href="#/products"
                color="inherit"
                sx={{
                  display: "block",
                  mb: 1,
                  textDecoration: "none",
                  "&:hover": { color: "primary.main" },
                }}
              >
                Products
              </Link>
              <Link
                href="#/contact"
                color="inherit"
                sx={{
                  display: "block",
                  textDecoration: "none",
                  "&:hover": { color: "primary.main" },
                }}
              >
                Contact
              </Link>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: 1,
            borderColor: "rgba(255, 255, 255, 0.1)",
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
            {currentYear} Budaful Door Designs. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
