// frontend/src/theme.js

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    primary: {
      main: '#0A1F44',         // deep navy
      contrastText: '#C49B66'  // updated gold
    },
    secondary: {
      main: '#C49B66',         // updated gold
      contrastText: '#0A1F44'
    },
    text: {
      primary: '#0A1F44',
      secondary: '#4A4A4A',
    },
  },
  typography: {
    fontFamily: '"Playfair Display", serif',
    h1: { fontWeight: 700, color: '#0A1F44' },
    h5: { color: '#0A1F44' },
    button: { textTransform: 'none', fontWeight: 600 }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0A1F44',
          color: '#C49B66',
          boxShadow: 'none',
          borderBottom: '2px solid #C49B66'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#C49B66',      // your preferred gold
          color: '#0A1F44',
          '&:hover': { backgroundColor: '#B38A5A' }
        }
      }
    }
  }
});

export default theme;
