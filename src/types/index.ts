export interface Product {
  sku: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  category?: string;
  width?: string;
  length?: string;
  isWired?: boolean;
  color?: string;
  brand?: string;
}

export interface CustomOptions {
  width?: string;
  length?: string;
  isWired?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  shippingAddress1: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  billingAddress1: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
  phone: string;
  notes?: string;
  useSameAddress: boolean;
}
