import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import Cart from "./components/Cart";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProductEditor from "./pages/AdminProductEditor";
import EditProduct from "./pages/EditProduct";
import Profile from "./pages/Profile";
import OrderDetails from "./pages/OrderDetails";
import { HelmetProvider } from "react-helmet-async";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./store/userSlice";
import api from "./utils/api";
import { theme } from "./theme";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { NotificationProvider } from "./context/NotificationContext";
import { handleApiError } from "./utils/errorHandler";

// Separate component for auth logic
function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      console.log('Checking auth status, token exists:', !!token);
      
      if (token) {
        try {
          const response = await api.get("/auth/profile");
          console.log('Auth check response:', response);
          
          // Direct axios response, extract user directly
          dispatch(setUser(response.data.user));
          console.log('User set from auth check:', response.data.user);
        } catch (error) {
          console.error('Auth check error:', error);
          // Clear invalid token
          localStorage.removeItem("token");
          handleApiError(error);
        }
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  return <>{children}</>;
}

// Main app layout with routes
function AppRoutes() {
  const location = useLocation();
  const showCategoryNav =
    location.pathname === "/" || location.pathname.startsWith("/products");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <ErrorBoundary>
        <Header />
        {showCategoryNav && <CategoryNav />}
        <Box component="main" sx={{ flex: 1, py: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/category/:categoryId" element={<Products />} />
            <Route path="/product/:sku" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order/:orderId"
              element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products/:sku/edit"
              element={
                <ProtectedRoute requireAdmin>
                  <EditProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products/:productId"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminProductEditor />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
        <Cart />
        <Footer />
      </ErrorBoundary>
    </Box>
  );
}

// Main app content with providers
function AppContent() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

// Root component
function App(): JSX.Element {
  return (
    <Provider store={store}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <HelmetProvider>
          <ThemeProvider theme={theme}>
            <NotificationProvider>
              <CssBaseline />
              <ErrorBoundary>
                <AppContent />
              </ErrorBoundary>
            </NotificationProvider>
          </ThemeProvider>
        </HelmetProvider>
      </Router>
    </Provider>
  );
}

export default App;
