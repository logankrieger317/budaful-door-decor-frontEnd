import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { CustomerInfo } from "../types";
import orderService from "../services/orderService";
import { clearCart } from "../store/cartSlice";
import { useState } from "react";

interface OrderConfirmationState {
  customerInfo: CustomerInfo;
  items: any[];
  total: number;
  isPending: boolean;
  orderNumber?: string;
}

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const state = location.state as OrderConfirmationState;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>("");

  const handleContinueShopping = () => {
    navigate("/", { replace: true });
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setError("");
    
    try {
      const order = await orderService.createOrder(state.customerInfo, state.items);
      setOrderNumber(order.id);
      setOrderConfirmed(true);
      dispatch(clearCart());
    } catch (error) {
      console.error("Error creating order:", error);
      setError("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!state?.customerInfo) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, textAlign: "center" }}>
          <Typography variant="h5" color="error" gutterBottom>
            Order information not found
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleContinueShopping}
            sx={{ mt: 3 }}
          >
            Return to Home
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 8,
          mb: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {orderConfirmed ? (
          <CheckCircleOutlineIcon
            sx={{ fontSize: 64, color: "success.main", mb: 2 }}
          />
        ) : (
          <Typography variant="h4" component="h1" gutterBottom>
            Order Review
          </Typography>
        )}
        
        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={3} sx={{ width: "100%", mt: 4, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {orderConfirmed ? "Order Details" : "Review Your Order"}
          </Typography>
          <Divider sx={{ my: 2 }} />

          {orderConfirmed && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Order Number
              </Typography>
              <Typography variant="body1">{orderNumber}</Typography>
            </Box>
          )}

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Total Amount
            </Typography>
            <Typography variant="body1">${state.total.toFixed(2)}</Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Shipping Address
            </Typography>
            <Typography variant="body1">
              {state.customerInfo.firstName} {state.customerInfo.lastName}
              <br />
              {state.customerInfo.address.street}
              <br />
              {state.customerInfo.address.city}, {state.customerInfo.address.state}{" "}
              {state.customerInfo.address.zipCode}
            </Typography>
          </Box>

          {!orderConfirmed && (
            <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Place Order"
                )}
              </Button>
            </Box>
          )}

          {orderConfirmed && (
            <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleContinueShopping}
              >
                Continue Shopping
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
