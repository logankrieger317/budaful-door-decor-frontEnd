import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#87A878",    // Sage green
      light: "#B5C5AA",   // Light sage
      dark: "#5F7356",    // Dark sage
    },
    secondary: {
      main: "#38A169",
      light: "#68D391",
      dark: "#2F855A",
    },
    background: {
      default: "#F7FAFC",
      paper: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "3.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
      },
    },
  },
});
