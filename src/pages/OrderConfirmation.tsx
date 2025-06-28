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
      // Create order with guest flag if user is not authenticated
      const order = await orderService.createOrder(
        state.customerInfo,
        state.items
      );
      
      setOrderNumber(order.id);
      setOrderConfirmed(true);
      dispatch(clearCart());
    } catch (error: any) {
      console.error("Error creating order:", error);
      if (error.name === 'AuthenticationError') {
        setError("Authentication error. Please try again or proceed as a guest.");
      } else {
        setError(error.message || "Failed to place order. Please try again.");
      }
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
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          {orderConfirmed ? (
            <Box sx={{ textAlign: "center" }}>
              <CheckCircleOutlineIcon
                color="success"
                sx={{ fontSize: 64, mb: 2 }}
              />
              <Typography variant="h4" gutterBottom>
                Order Confirmed!
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Your order number is: {orderNumber}
              </Typography>
              <Typography variant="body1" paragraph>
                We'll send you an email confirmation shortly.
              </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="h4" gutterBottom>
                Order Summary
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              <Typography variant="body1" paragraph>
                Please review your order details below:
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Customer Information
                </Typography>
                <Typography>
                  {state.customerInfo.firstName} {state.customerInfo.lastName}
                </Typography>
                <Typography>{state.customerInfo.email}</Typography>
                <Typography>{state.customerInfo.phone}</Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Shipping Address
                </Typography>
                <Typography>
                  {state.customerInfo.address.street}
                  <br />
                  {state.customerInfo.address.city},{" "}
                  {state.customerInfo.address.state}{" "}
                  {state.customerInfo.address.zipCode}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Order Items
                </Typography>
                {state.items.map((item, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Typography>
                      {item.name} x {item.quantity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${Number(item.price).toFixed(2)} each
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6">Total: ${state.total.toFixed(2)}</Typography>
              </Box>

              {state.customerInfo.notes && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Order Notes
                    </Typography>
                    <Typography>{state.customerInfo.notes}</Typography>
                  </Box>
                </>
              )}
            </>
          )}

          {!orderConfirmed && (
            <Box
              sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}
            >
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
