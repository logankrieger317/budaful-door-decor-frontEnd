import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Button,
  IconButton,
  Alert,
  Collapse,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import api from '../config/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface OrderItem {
  id: string;
  quantity: number;
  priceAtTime: number | string;
  Product: {
    name: string;
    sku: string;
    price: number;
  };
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  phone?: string;
  totalAmount: number | string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: string;
  billingAddress: string;
  notes?: string;
}

interface Product {
  sku: string;
  name: string;
  description: string;
  price: number | string;
  category: string;
  quantity: number;
  imageUrl?: string;
}

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['pending', 'completed', 'failed', 'refunded'];

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function OrderRow({ order, onOrderUpdate }: { order: Order; onOrderUpdate: (orderId: string, updates: any) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (field: 'status' | 'paymentStatus', value: string) => {
    setLoading(true);
    try {
      await onOrderUpdate(order.id, { [field]: value });
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{order.id.slice(0, 8)}...</TableCell>
        <TableCell>{order.customerName}</TableCell>
        <TableCell>
          <div>{order.customerEmail}</div>
          {order.phone && <div style={{ color: 'gray', fontSize: '0.9em' }}>{order.phone}</div>}
        </TableCell>
        <TableCell>${parseFloat(order.totalAmount.toString()).toFixed(2)}</TableCell>
        <TableCell>
          <FormControl size="small" fullWidth disabled={loading}>
            <Select
              value={order.status}
              onChange={(e) => handleStatusChange('status', e.target.value)}
            >
              {ORDER_STATUSES.map(status => (
                <MenuItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </TableCell>
        <TableCell>
          <FormControl size="small" fullWidth disabled={loading}>
            <Select
              value={order.paymentStatus}
              onChange={(e) => handleStatusChange('paymentStatus', e.target.value)}
            >
              {PAYMENT_STATUSES.map(status => (
                <MenuItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </TableCell>
        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Shipping Address
                  </Typography>
                  <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>
                    {order.shippingAddress}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Billing Address
                  </Typography>
                  <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>
                    {order.billingAddress}
                  </Typography>
                </Grid>
                {order.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Notes
                    </Typography>
                    <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>
                      {order.notes}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              <Typography variant="h6" gutterBottom component="div">
                Order Items
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.Product.name}</TableCell>
                      <TableCell>{item.Product.sku}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">${parseFloat(item.priceAtTime.toString()).toFixed(2)}</TableCell>
                      <TableCell align="right">
                        ${(item.quantity * parseFloat(item.priceAtTime.toString())).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const AdminDashboard = () => {
  const [tab, setTab] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          api.get<Order[]>('/api/admin/orders'),
          api.get<Product[]>('/api/admin/products')
        ]);

        console.log('Orders:', ordersRes.data);
        console.log('Products:', productsRes.data);

        setOrders(ordersRes.data);
        setProducts(productsRes.data);
        setError('');
      } catch (error: any) {
        console.error('Error fetching data:', error);
        if (error?.response?.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        } else {
          setError(error?.response?.data?.message || 'Error loading dashboard data');
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleOrderUpdate = async (orderId: string, updates: any) => {
    try {
      const response = await api.put(`/api/admin/orders/${orderId}`, updates);
      setOrders(orders.map(order => 
        order.id === orderId ? response.data : order
      ));
      setError('');
    } catch (error: any) {
      console.error('Error updating order:', error);
      if (error?.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
      throw error;
    }
  };

  const handleDeleteProduct = async (sku: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/api/admin/products/${sku}`);
      setProducts(products.filter(p => p.sku !== sku));
      setError('');
    } catch (error: any) {
      console.error('Error deleting product:', error);
      if (error?.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else {
        setError(error?.response?.data?.message || 'Error deleting product');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Admin Dashboard
          </Typography>
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/admin/products/new')}
              sx={{ mr: 2 }}
            >
              Add Product
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Paper sx={{ width: '100%', mb: 2 }}>
          <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
            <Tab label={`Orders (${orders.length})`} />
            <Tab label={`Products (${products.length})`} />
          </Tabs>

          <TabPanel value={tab} index={0}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Payment</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <OrderRow key={order.id} order={order} onOrderUpdate={handleOrderUpdate} />
                  ))}
                  {orders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No orders found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>SKU</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.sku}>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>${parseFloat(product.price.toString()).toFixed(2)}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => navigate(`/admin/products/${product.sku}/edit`)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteProduct(product.sku)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {products.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No products found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
