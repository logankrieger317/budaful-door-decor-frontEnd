import axios from 'axios';
import { Product } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface CreateProductInput extends Omit<Product, 'sku'> {}
export interface UpdateProductInput extends Partial<CreateProductInput> {}

const handleApiError = (error: any): never => {
  console.error('API Error:', error);
  throw error;
};

// API methods
export const productsApi = {
  // Get all products
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await axios.get<any[]>(`${API_URL}/api/products`);
      
      // Convert price strings to numbers and ensure all required fields
      const products = response.data.map(product => {
        // Convert price string to number, removing any currency symbols and handling decimals
        const rawPrice = typeof product.price === 'string' 
          ? product.price.replace(/[^0-9.-]+/g, '')
          : product.price;
        const price = Number(rawPrice);

        return {
          ...product,
          price: isNaN(price) ? 0 : price,
          imageUrl: product.imageUrl || '',
          quantity: typeof product.quantity === 'number' ? product.quantity : 0,
          width: typeof product.width === 'number' ? product.width : 0,
          length: typeof product.length === 'number' ? product.length : 0,
          isWired: Boolean(product.isWired),
          color: product.color || '',
          brand: product.brand || ''
        };
      });
      
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  // Get product by SKU
  async getProductBySku(sku: string): Promise<Product | null> {
    try {
      const response = await axios.get<Product>(`${API_URL}/api/products/${sku}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response = await axios.get<any[]>(`${API_URL}/api/products?category=${category}`);
      
      // Convert price strings to numbers and ensure all required fields
      const products = response.data.map(product => {
        // Convert price string to number, removing any currency symbols and handling decimals
        const rawPrice = typeof product.price === 'string' 
          ? product.price.replace(/[^0-9.-]+/g, '')
          : product.price;
        const price = Number(rawPrice);

        return {
          ...product,
          price: isNaN(price) ? 0 : price,
          imageUrl: product.imageUrl || '',
          quantity: typeof product.quantity === 'number' ? product.quantity : 0,
          width: typeof product.width === 'number' ? product.width : 0,
          length: typeof product.length === 'number' ? product.length : 0,
          isWired: Boolean(product.isWired),
          color: product.color || '',
          brand: product.brand || ''
        };
      });
      
      return products;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  },

  // Create new product
  async create(product: CreateProductInput): Promise<Product> {
    try {
      const response = await axios.post<Product>(`${API_URL}/api/products`, product);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      return handleApiError(error);
    }
  },

  // Update product
  async update(sku: string, product: UpdateProductInput): Promise<Product> {
    try {
      const response = await axios.put<Product>(`${API_URL}/api/products/${sku}`, product);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      return handleApiError(error);
    }
  },

  // Update product quantity
  async updateQuantity(sku: string, quantity: number): Promise<Product> {
    try {
      const response = await axios.patch<Product>(`${API_URL}/api/products/${sku}/quantity`, { quantity });
      return response.data;
    } catch (error) {
      console.error('Error updating product quantity:', error);
      return handleApiError(error);
    }
  },

  // Delete product
  async delete(sku: string): Promise<void> {
    try {
      await axios.delete<void>(`${API_URL}/api/products/${sku}`);
    } catch (error) {
      console.error('Error deleting product:', error);
      return handleApiError(error);
    }
  }
};

export default productsApi;
