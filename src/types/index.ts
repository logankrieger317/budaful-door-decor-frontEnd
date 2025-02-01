export interface Product {
  sku: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  stock: number;
  color?: string;
  brand?: string;
}

export interface CustomOptions {
  width?: string;
  length?: string;
  isWired?: boolean;
}

export interface CartItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
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
