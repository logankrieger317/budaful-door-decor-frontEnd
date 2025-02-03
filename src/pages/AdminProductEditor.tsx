import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  FormControlLabel,
  Switch,
} from '@mui/material';
import api from '../config/api';

interface ProductForm {
  name: string;
  sku: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  quantity: number;
  width: number;
  length: number;
  color: string;
  brand: string;
  isWired: boolean;
}

const initialForm: ProductForm = {
  name: '',
  sku: '',
  description: '',
  price: 0,
  category: '',
  imageUrl: '',
  quantity: 0,
  width: 0,
  length: 0,
  color: '',
  brand: '',
  isWired: false,
};

const AdminProductEditor = () => {
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { productId } = useParams();
  const isEditing = productId !== 'new';

  useEffect(() => {
    if (isEditing) {
      const fetchProduct = async () => {
        try {
          const response = await api.get(`/api/admin/products/${productId}`);
          setForm(response.data);
        } catch (error) {
          console.error('Error fetching product:', error);
          if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            navigate('/admin/login');
          } else {
            setError('Error loading product');
          }
        }
      };
      fetchProduct();
    }
  }, [productId, isEditing, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/api/admin/products/${productId}`, form);
      } else {
        await api.post('/api/admin/products', form);
      }
      setSuccess('Product saved successfully');
      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (error) {
      console.error('Error saving product:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else {
        setError('Error saving product');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {isEditing ? 'Edit Product' : 'New Product'}
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="SKU"
              name="sku"
              value={form.sku}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
              required
            />
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Image URL"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Quantity"
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Width"
              name="width"
              type="number"
              value={form.width}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Length"
              name="length"
              type="number"
              value={form.length}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Color"
              name="color"
              value={form.color}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Brand"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              margin="normal"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.isWired}
                  onChange={handleChange}
                  name="isWired"
                />
              }
              label="Is Wired"
              sx={{ mt: 2 }}
            />
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                {isEditing ? 'Update Product' : 'Create Product'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={() => navigate('/admin/dashboard')}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminProductEditor;
