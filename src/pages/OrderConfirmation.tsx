import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { CustomerInfo } from "../types";

interface OrderConfirmationState {
  orderNumber: string;
  total: number;
  customerInfo: CustomerInfo;
}

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as OrderConfirmationState;

  const handleContinueShopping = () => {
    navigate('/', { replace: true });
  };

  if (!state?.orderNumber) {
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
        <CheckCircleOutlineIcon
          sx={{ fontSize: 64, color: "success.main", mb: 2 }}
        />
        <Typography variant="h4" component="h1" gutterBottom>
          Order Confirmed!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Thank you for your order. Your order has been successfully placed.
        </Typography>

        <Paper elevation={3} sx={{ width: "100%", mt: 4, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Order Details
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Order Number
            </Typography>
            <Typography variant="body1">{state.orderNumber}</Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Total Amount
            </Typography>
            <Typography variant="body1">${state.total.toFixed(2)}</Typography>
          </Box>

          {state.customerInfo && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Shipping Address
              </Typography>
              <Typography variant="body1">
                {state.customerInfo.firstName} {state.customerInfo.lastName}
                <br />
                {state.customerInfo.address.street}
                <br />
                {state.customerInfo.address.city},{" "}
                {state.customerInfo.address.state}{" "}
                {state.customerInfo.address.zipCode}
              </Typography>
            </Box>
          )}
        </Paper>

        <Button
          variant="contained"
          color="primary"
          onClick={handleContinueShopping}
          sx={{ mt: 4 }}
        >
          Continue Shopping
        </Button>
      </Box>
    </Container>
  );
}
