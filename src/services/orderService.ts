import type { CartItem, CustomerInfo } from '../types';
import { api } from '../api/client';
import { handleApiError } from '../utils/errorHandler';

const API_URL = import.meta.env.VITE_API_URL || 'https://budafuldoordecorbackend-production.up.railway.app';

export interface OrderItem {
  id?: string;
  productSku: string;
  quantity: number;
  price: number;
  priceAtTime?: string;
  orderId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: string;
  billingAddress: string;
  phone?: string;
  notes?: string;
  totalAmount: string;
  status: string;
  paymentStatus: string;
  items: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
  paymentIntentId?: string | null;
}

interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
}

interface OrderResponse {
  order: Order;
}

export const orderService = {
  async createOrder(customerInfo: CustomerInfo, cartItems: CartItem[]): Promise<Order> {
    try {
      // Map cart items to order items with proper price formatting
      const orderItems = cartItems.map(item => {
        const price = Number(item.price);
        if (isNaN(price)) {
          throw new Error(`Invalid price for item ${item.sku}`);
        }
        return {
          productSku: item.sku || item.name || `product-${Date.now()}`,
          quantity: item.quantity,
          price: price
        };
      });

      // Calculate total with proper decimal handling
      const total = cartItems.reduce((sum, item) => {
        const price = Number(item.price);
        if (isNaN(price)) {
          throw new Error(`Invalid price for item ${item.sku}`);
        }
        return sum + (price * item.quantity);
      }, 0);

      if (isNaN(total)) {
        throw new Error('Invalid total amount calculation');
      }

      // Create order data
      const orderData = {
        customerEmail: customerInfo.email,
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        shippingAddress: `${customerInfo.address.street}, ${customerInfo.address.city}, ${customerInfo.address.state} ${customerInfo.address.zipCode}`,
        billingAddress: `${customerInfo.address.street}, ${customerInfo.address.city}, ${customerInfo.address.state} ${customerInfo.address.zipCode}`,
        phone: customerInfo.phone,
        notes: customerInfo.notes,
        items: orderItems,
        totalAmount: total
      };

      console.log('Sending order data:', JSON.stringify(orderData, null, 2));
      console.log('Cart items:', JSON.stringify(cartItems, null, 2));
      console.log('Customer info:', JSON.stringify(customerInfo, null, 2));
      
      // Use the configured API client without auth for guest orders
      const response = await api.post<ApiResponse<OrderResponse>>('/api/orders/guest', orderData, { skipAuth: true });

      if (response.success && response.data.data.order) {
        return response.data.data.order;
      }
      
      throw new Error(response.error || 'Invalid server response format');
    } catch (error) {
      console.error('Error details:', error);
      return handleApiError(error);
    }
  }
};

export default orderService;
