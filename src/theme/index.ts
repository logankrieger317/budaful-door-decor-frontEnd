import { createTheme, alpha } from '@mui/material';

// Create a data URL for the ribbon pattern
const ribbonPattern = `
  data:image/svg+xml,${encodeURIComponent(`
    <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="ribbon" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M30 5C35 5 35 15 30 15S25 5 30 5M30 45C35 45 35 55 30 55S25 45 30 45M5 30C5 35 15 35 15 30S5 25 5 30M45 30C45 35 55 35 55 30S45 25 45 30" fill="none" stroke="#87A878" stroke-width="0.5" opacity="0.15"/>
          <circle cx="30" cy="30" r="15" fill="none" stroke="#87A878" stroke-width="0.5" opacity="0.15"/>
        </pattern>
      </defs>
      <rect width="60" height="60" fill="url(#ribbon)"/>
    </svg>
  `)}
`;

// Create a data URL for the wreath pattern overlay
const wreathPattern = `
  data:image/svg+xml,${encodeURIComponent(`
    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="wreath" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
          <circle cx="100" cy="100" r="80" fill="none" stroke="#87A878" stroke-width="1" opacity="0.1"/>
          <path d="M100 20C120 40 120 80 100 100S40 120 20 100" fill="none" stroke="#87A878" stroke-width="1" opacity="0.1"/>
          <path d="M100 180C80 160 80 120 100 100S160 80 180 100" fill="none" stroke="#87A878" stroke-width="1" opacity="0.1"/>
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#wreath)"/>
    </svg>
  `)}
`;

export const theme = createTheme({
  palette: {
    primary: {
      main: '#87A878',    // Sage green
      light: '#B5C5AA',   // Light sage
      dark: '#5F7356',    // Dark sage
    },
    secondary: {
      main: '#8D6E63',    // Warm brown
      light: '#A1887F',
      dark: '#6D4C41',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '3.5rem',
      fontWeight: 600,
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '2rem',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '1rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '50px',
          padding: '8px 24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: `0 8px 24px ${alpha('#000', 0.06)}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 12px 32px ${alpha('#000', 0.1)}`,
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: '#FFFFFF',
          backgroundImage: `
            url("${ribbonPattern}"),
            url("${wreathPattern}")
          `,
          backgroundRepeat: 'repeat, repeat',
          backgroundSize: '60px 60px, 200px 200px',
          backgroundPosition: 'center center',
          backgroundBlendMode: 'multiply',
          '&::before': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            background: `
              radial-gradient(
                circle at 50% 50%,
                ${alpha('#B5C5AA', 0.03)} 0%,
                transparent 75%
              )
            `,
            backgroundSize: '100% 100%',
            zIndex: -1,
          },
        },
      },
    },
  },
});
