import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Snackbar,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { RootState } from "../store";
import { clearCart } from "../store/cartSlice";
import { setUser } from "../store/userSlice";
import { CartItem } from "../types";

const steps = ["Review Order", "Customer Information", "Confirm Order"];

export default function Checkout(): JSX.Element {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState("");

  // Form state
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  // Shipping address state
  const [shippingAddress1, setShippingAddress1] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [shippingZip, setShippingZip] = useState("");

  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.currentUser);

  const total = items.reduce<number>(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0
  );

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // If user wants to create an account
      if (!user && createAccount) {
        const registerResponse = await fetch(
          process.env.REACT_APP_API_URL + "/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
              firstName,
              lastName,
            }),
          }
        );

        if (!registerResponse.ok) {
          throw new Error("Failed to create account");
        }

        const { user: newUser, token } = await registerResponse.json();
        dispatch(setUser(newUser));
        localStorage.setItem("token", token);
      }

      // Navigate to order confirmation
      navigate("/order-confirmation", {
        state: {
          customerInfo: {
            email,
            firstName,
            lastName,
            phone,
            address: {
              street: shippingAddress1,
              city: shippingCity,
              state: shippingState,
              zipCode: shippingZip,
            },
            notes,
          },
          items,
          total,
          isPending: true,
        },
      });
    } catch (err) {
      console.error("Error in checkout:", err);
      setErrorMessage("An error occurred during checkout. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const apiUrl = "https://budafuldoordecorbackend-production.up.railway.app";
      console.log('Sending order to:', `${apiUrl}/api/orders`);

      // Format address as a string
      const formattedAddress = `${shippingAddress1}, ${shippingCity}, ${shippingState} ${shippingZip}`;

      const orderPayload = {
        customerEmail: email,
        customerName: `${firstName} ${lastName}`,
        shippingAddress: formattedAddress,
        billingAddress: formattedAddress,
        items: items.map(item => ({
          productSku: item.sku,
          quantity: Number(item.quantity),
          price: Number(item.price)
        })),
        phone,
        notes: notes || "",
        totalAmount: Number(total.toFixed(2))
      };

      console.log('Order payload:', JSON.stringify(orderPayload, null, 2));

      const orderResponse = await fetch(`${apiUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user && { Authorization: `Bearer ${localStorage.getItem("token")}` }),
        },
        body: JSON.stringify(orderPayload),
      });

      const responseData = await orderResponse.json();
      console.log('Order response:', responseData);

      if (!orderResponse.ok) {
        console.error('Order creation failed:', responseData);
        throw new Error(responseData.message || "Failed to create order");
      }

      const { data: { order } } = responseData;

      // Clear cart after successful order
      dispatch(clearCart());

      // Navigate to order confirmation
      navigate("/order-confirmation", {
        state: {
          orderId: order.id,
          customerInfo: {
            email,
            firstName,
            lastName,
            phone,
            address: formattedAddress,
            notes,
          },
          items,
          total,
          isPending: false,
        },
      });
    } catch (error) {
      console.error("Error in checkout:", error);
      setErrorMessage(error instanceof Error ? error.message : "An error occurred during checkout. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderOrderReview = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      <List disablePadding>
        {items.map((item: CartItem) => (
          <ListItem key={item.id}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body1">{item.name}</Typography>
              {item.options &&
                Object.entries(item.options).map(([key, value]) => (
                  <Typography key={key} variant="body2" color="text.secondary">
                    {key}: {value}
                  </Typography>
                ))}
              <Typography variant="body2" color="text.secondary">
                Quantity: {item.quantity}
              </Typography>
            </Box>
            <Typography variant="body2">
              ${(item.price * item.quantity).toFixed(2)}
            </Typography>
          </ListItem>
        ))}
        <Divider />
        <ListItem>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            ${total.toFixed(2)}
          </Typography>
        </ListItem>
      </List>
    </Box>
  );

  const renderCustomerInfoForm = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="firstName"
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="lastName"
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="email"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="phone"
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="shippingAddress1"
            label="Street Address"
            value={shippingAddress1}
            onChange={(e) => setShippingAddress1(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="shippingCity"
            label="City"
            value={shippingCity}
            onChange={(e) => setShippingCity(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            required
            fullWidth
            name="shippingState"
            label="State"
            value={shippingState}
            onChange={(e) => setShippingState(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            required
            fullWidth
            name="shippingZip"
            label="ZIP Code"
            value={shippingZip}
            onChange={(e) => setShippingZip(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            name="notes"
            label="Order Notes (Optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Grid>
        {/* Account Creation Option */}
        {!user && (
          <Box sx={{ mt: 3, mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={createAccount}
                  onChange={(e) => setCreateAccount(e.target.checked)}
                  color="primary"
                />
              }
              label="Create an account for faster checkout next time"
            />
            {createAccount && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
          </Box>
        )}
      </Grid>
    );
  };

  const renderConfirmation = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Confirmation
      </Typography>
      <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50", mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Customer Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              Name: {firstName} {lastName}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">Email: {email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">Phone: {phone}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2">
              Address: {shippingAddress1}, {shippingCity}, {shippingState}{" "}
              {shippingZip}
            </Typography>
          </Grid>
          {notes && (
            <Grid item xs={12}>
              <Typography variant="body2">Notes: {notes}</Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
      {renderOrderReview()}
    </Box>
  );

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderOrderReview();
      case 1:
        return renderCustomerInfoForm();
      case 2:
        return renderConfirmation();
      default:
        return "Unknown step";
    }
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Your cart is empty
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button variant="contained" onClick={() => navigate("/home")}>
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card>
        <CardContent>
          {activeStep === 1 ? (
            <form onSubmit={handleSubmit}>
              {renderCustomerInfoForm()}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
              >
                <Button
                  type="button"
                  onClick={handleBack}
                  sx={{ minWidth: 200 }}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ minWidth: 200 }}
                  disabled={
                    !firstName ||
                    !lastName ||
                    !email ||
                    !phone ||
                    !shippingAddress1 ||
                    !shippingCity ||
                    !shippingState ||
                    !shippingZip ||
                    (createAccount && !password)
                  }
                >
                  Next
                </Button>
              </Box>
            </form>
          ) : (
            <>
              {getStepContent(activeStep)}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
              >
                <Button
                  type="button"
                  onClick={handleBack}
                  sx={{ minWidth: 200 }}
                  disabled={activeStep === 0}
                >
                  Back
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="button"
                    variant="contained"
                    onClick={handlePlaceOrder}
                    sx={{ minWidth: 200 }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Placing Order..." : "Place Order"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="contained"
                    onClick={handleNext}
                    sx={{ minWidth: 200 }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setErrorMessage("")}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
