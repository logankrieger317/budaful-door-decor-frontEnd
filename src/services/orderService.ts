import axios from 'axios';
import type { CartItem, CustomerInfo } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface OrderItem {
  productSku: string;
  quantity: number;
  price: number;
}

interface Order {
  id?: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: string;
  billingAddress: string;
  phone?: string;
  notes?: string;
  total: number;
  status: string;
  paymentStatus: string;
  items: OrderItem[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface OrderResponse {
  order: Order;
  clientSecret: string;
}

export const orderService = {
  async createOrder(customerInfo: CustomerInfo, cartItems: CartItem[]): Promise<ApiResponse<OrderResponse>> {
    try {
      // Map cart items to order items
      const orderItems = cartItems.map(item => ({
        productSku: item.sku,
        quantity: item.quantity,
        price: item.price
      }));

      // Calculate total amount
      const total = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

      // Create order data
      const orderData = {
        customerEmail: customerInfo.email,
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        shippingAddress: `${customerInfo.address.street}, ${customerInfo.address.city}, ${customerInfo.address.state} ${customerInfo.address.zipCode}`,
        billingAddress: `${customerInfo.address.street}, ${customerInfo.address.city}, ${customerInfo.address.state} ${customerInfo.address.zipCode}`,
        phone: customerInfo.phone,
        notes: customerInfo.notes,
        items: orderItems,
        total,
        status: 'pending',
        paymentStatus: 'pending'
      };

      console.log('Sending order data to:', `${API_URL}/api/orders`);
      console.log('Order data:', JSON.stringify(orderData, null, 2));
      
      const response = await axios.post<ApiResponse<OrderResponse>>(`${API_URL}/api/orders`, orderData);
      console.log('Server response:', JSON.stringify(response.data, null, 2));

      return response.data;
    } catch (error) {
      console.error('Error details:', error);
      // Type guard for Axios error
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
        
        if (axiosError.response?.status === 400) {
          throw new Error(axiosError.response.data?.message || 'Invalid order data');
        } else if (axiosError.response?.status === 404) {
          throw new Error('Product not found');
        } else if (axiosError.response?.status === 500) {
          throw new Error('Server error while creating order');
        }
        throw new Error(axiosError.response?.data?.message || axiosError.message || 'Error creating order');
      }
      throw new Error('Error creating order');
    }
  }
};

export default orderService;
