import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { store } from '../store';
import { theme } from '../theme/index';
import Header from '../components/Header';
import CategoryNav from '../components/CategoryNav';
import Cart from '../components/Cart';
import Footer from '../components/Footer';
import Products from '../pages/Products';
import '../index.css';

function ProductsApp() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <CategoryNav />
      <Box component="main" sx={{ flex: 1, py: 4 }}>
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="*" element={<Products />} />
        </Routes>
      </Box>
      <Cart />
      <Footer />
    </Box>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ProductsApp />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
