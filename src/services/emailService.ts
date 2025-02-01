import axios from 'axios';
import type { CartItem, CustomerInfo } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface OrderEmailParams {
  customerInfo: CustomerInfo;
  items: CartItem[];
  total: number;
  orderNumber: string;
}

// Helper function to handle API errors
const handleApiError = (error: unknown) => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { status: number; data: any; headers: any } };
    if (axiosError.response) {
      console.error('API Error Response:', axiosError.response);
    }
  }
  throw error;
};

export const emailService = {
  async sendOrderConfirmationEmail({ customerInfo, items, total, orderNumber }: OrderEmailParams): Promise<void> {
    try {
      console.log('Sending confirmation email with data:', { customerInfo, items, total, orderNumber });
      const response = await axios.post(`${API_URL}/api/email/order-confirmation`, {
        customerInfo,
        items,
        total,
        orderNumber,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 200) {
        console.log('Order confirmation email sent successfully');
      } else {
        console.error('Failed to send order confirmation email:', response.statusText);
        throw new Error('Failed to send order confirmation email');
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      handleApiError(error);
    }
  },

  async sendOrderNotificationEmail({ customerInfo, items, total, orderNumber }: OrderEmailParams): Promise<void> {
    try {
      console.log('Sending notification email with data:', { customerInfo, items, total, orderNumber });
      const response = await axios.post(`${API_URL}/api/email/order-notification`, {
        customerInfo,
        items,
        total,
        orderNumber,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 200) {
        console.log('Order notification email sent successfully');
      } else {
        console.error('Failed to send order notification email:', response.statusText);
        throw new Error('Failed to send order notification email');
      }
    } catch (error) {
      console.error('Error sending notification email:', error);
      handleApiError(error);
    }
  },
};

export default emailService;
