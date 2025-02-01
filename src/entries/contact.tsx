import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../store';
import { theme } from '../theme/index';
import Header from '../components/Header';
import CategoryNav from '../components/CategoryNav';
import Footer from '../components/Footer';
import Contact from '../pages/Contact';
import '../index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename="/contact.html">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header />
          <CategoryNav />
          <Contact />
          <Footer />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
