import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import api from '../config/api';

interface Product {
  sku: string;
  name: string;
  description: string;
  price: number | string;
  category: string;
  quantity: number;
  imageUrl?: string;
}

const EditProduct = () => {
  const { sku } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [product, setProduct] = useState<Product>({
    sku: '',
    name: '',
    description: '',
    price: '',
    category: '',
    quantity: 0,
    imageUrl: '',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/api/admin/products/${sku}`);
        setProduct(response.data);
        setError('');
      } catch (error: any) {
        console.error('Error fetching product:', error);
        if (error?.response?.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        } else {
          setError(error?.response?.data?.message || 'Error loading product');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [sku, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/api/admin/products/${sku}`, product);
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error('Error updating product:', error);
      if (error?.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else {
        setError(error?.response?.data?.message || 'Error updating product');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? parseFloat(value) || value : value,
    }));
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Edit Product
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="SKU"
                  name="sku"
                  value={product.sku}
                  disabled
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  required
                  multiline
                  rows={4}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={product.price}
                  onChange={handleChange}
                  required
                  margin="normal"
                  inputProps={{ step: '0.01', min: '0' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={product.quantity}
                  onChange={handleChange}
                  required
                  margin="normal"
                  inputProps={{ step: '1', min: '0' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Category"
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Image URL"
                  name="imageUrl"
                  value={product.imageUrl || ''}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={saving}
                  >
                    {saving ? <CircularProgress size={24} /> : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    onClick={() => navigate('/admin/dashboard')}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default EditProduct;
