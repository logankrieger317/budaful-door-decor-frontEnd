import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store";
import { removeItem, updateQuantity, toggleCart } from "../store/cartSlice";
import { CartItem } from "../types";
import {
  Box,
  Typography,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Drawer,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface CartProps {
  onClose?: () => void;
}

const Cart: FC<CartProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, isOpen } = useSelector((state: RootState) => state.cart);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleClose = () => {
    dispatch(toggleCart());
    onClose?.();
  };

  const handleUpdateQuantity = (sku: string, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ sku: sku, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (sku: string) => {
    dispatch(removeItem({ sku: sku }));
  };

  const handleCheckout = () => {
    handleClose();
    navigate('/checkout');
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 400 },
          bgcolor: 'background.paper',
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Shopping Cart</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="subtitle1">
              Total: ${total.toFixed(2)}
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        <Divider />
        <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {items.map((item: CartItem) => (
            <ListItem 
              key={item.sku}
              sx={{
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' },
                gap: 1,
              }}
            >
              <ListItemText
                primary={item.name}
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </Typography>
                    {item.customOptions && (
                      <>
                        <Typography variant="body2" color="text.secondary">
                          Width: {item.customOptions.width}" | Length:{" "}
                          {item.customOptions.length}"
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Type:{" "}
                          {item.customOptions.isWired ? "Wired" : "Non-wired"}
                        </Typography>
                      </>
                    )}
                  </>
                }
              />
              <Box 
                sx={{ 
                  display: "flex", 
                  alignItems: "center",
                  justifyContent: { xs: 'center', sm: 'flex-end' },
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    handleUpdateQuantity(item.sku, item.quantity - 1)
                  }
                  sx={{ minWidth: 30 }}
                >
                  -
                </Button>
                <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    handleUpdateQuantity(item.sku, item.quantity + 1)
                  }
                  sx={{ minWidth: 30 }}
                >
                  +
                </Button>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleRemoveItem(item.sku)}
                  sx={{ ml: 1 }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
        {items.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default Cart;
