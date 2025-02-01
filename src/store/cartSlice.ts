import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.sku === action.payload.sku);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<{ sku: string }>) => {
      state.items = state.items.filter(item => item.sku !== action.payload.sku);
    },
    updateQuantity: (state, action: PayloadAction<{ sku: string; quantity: number }>) => {
      const item = state.items.find(item => item.sku === action.payload.sku);
      if (item) {
        item.quantity = Math.max(0, action.payload.quantity);
      }
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, updateQuantity, toggleCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
