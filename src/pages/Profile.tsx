import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Chip,
} from '@mui/material';
import { RootState } from '../store';
import api from '../utils/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Order {
  id: string;
  status: string;
  paymentStatus: string;
  totalAmount: number | string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  phone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items?: Array<{
    id: string;
    productSku: string;
    quantity: number;
    priceAtTime: number;
  }>;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Profile() {
  const [tabValue, setTabValue] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.currentUser);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await api.get(`/orders/user/${user.id}`);
        
        if (response.success) {
          setOrders(response.data);
        } else {
          throw new Error(response.error || 'Failed to fetch orders');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user.firstName}!
        </Typography>
        <Typography color="text.secondary">
          Manage your account and view your order history
        </Typography>
      </Paper>

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Profile" />
          <Tab label="Pending Orders" />
          <Tab label="Order History" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={8} lg={6}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Account Information
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ mb: 2 }}>
                    <Typography color="text.secondary" gutterBottom>
                      Name
                    </Typography>
                    <Typography>
                      {user.firstName} {user.lastName}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography color="text.secondary" gutterBottom>
                      Email
                    </Typography>
                    <Typography>{user.email}</Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => {/* TODO: Implement edit profile */}}
                  >
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" sx={{ py: 2 }}>
              {error}
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {orders.filter(order => ['pending', 'processing', 'shipped'].includes(order.status)).length === 0 ? (
                <Grid item xs={12}>
                  <Typography sx={{ py: 2 }}>No pending orders</Typography>
                </Grid>
              ) : (
                orders
                  .filter(order => ['pending', 'processing', 'shipped'].includes(order.status))
                  .map((order) => (
                    <Grid item xs={12} key={order.id}>
                      <Card sx={{ border: '2px solid', borderColor: 'primary.main' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">
                              Order #{order.id.slice(0, 8)}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Chip 
                                label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                color={
                                  order.status === 'pending' ? 'warning' :
                                  order.status === 'processing' ? 'info' :
                                  order.status === 'shipped' ? 'success' : 'default'
                                }
                                size="small"
                              />
                              <Typography color="text.secondary" variant="body2">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                          <Divider sx={{ my: 2 }} />
                          
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography color="text.secondary" gutterBottom>
                                Items
                              </Typography>
                              {order.items && order.items.length > 0 ? (
                                order.items.map((item, index) => (
                                  <Typography key={index} variant="body2">
                                    {item.quantity}x {item.productSku} - ${Number(item.priceAtTime).toFixed(2)}
                                  </Typography>
                                ))
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  No items listed
                                </Typography>
                              )}
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                              <Typography color="text.secondary" gutterBottom>
                                Shipping Address
                              </Typography>
                              <Typography variant="body2">{order.shippingAddress}</Typography>
                              
                              {order.phone && (
                                <>
                                  <Typography color="text.secondary" gutterBottom sx={{ mt: 1 }}>
                                    Phone
                                  </Typography>
                                  <Typography variant="body2">{order.phone}</Typography>
                                </>
                              )}
                            </Grid>
                          </Grid>
                          
                          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" color="primary">
                              Total: ${typeof order.totalAmount === 'string' ? order.totalAmount : Number(order.totalAmount).toFixed(2)}
                            </Typography>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => navigate(`/order/${order.id}`)}
                            >
                              View Details
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
              )}
            </Grid>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" sx={{ py: 2 }}>
              {error}
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {orders.filter(order => ['delivered', 'cancelled'].includes(order.status)).length === 0 ? (
                <Grid item xs={12}>
                  <Typography sx={{ py: 2 }}>No completed orders</Typography>
                </Grid>
              ) : (
                orders
                  .filter(order => ['delivered', 'cancelled'].includes(order.status))
                  .map((order) => (
                    <Grid item xs={12} key={order.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">
                              Order #{order.id.slice(0, 8)}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              <Chip 
                                label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                color={order.status === 'delivered' ? 'success' : 'error'}
                                size="small"
                              />
                              <Typography color="text.secondary" variant="body2">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                          <Divider sx={{ my: 2 }} />
                          
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={8}>
                              <Typography color="text.secondary" gutterBottom>
                                Items
                              </Typography>
                              {order.items && order.items.length > 0 ? (
                                order.items.map((item, index) => (
                                  <Typography key={index} variant="body2">
                                    {item.quantity}x {item.productSku} - ${Number(item.priceAtTime).toFixed(2)}
                                  </Typography>
                                ))
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  No items listed
                                </Typography>
                              )}
                            </Grid>
                            
                            <Grid item xs={12} md={4}>
                              <Typography color="text.secondary" gutterBottom>
                                Total Amount
                              </Typography>
                              <Typography variant="h6">
                                ${typeof order.totalAmount === 'string' ? order.totalAmount : Number(order.totalAmount).toFixed(2)}
                              </Typography>
                            </Grid>
                          </Grid>
                          
                          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => navigate(`/order/${order.id}`)}
                            >
                              View Details
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
              )}
            </Grid>
          )}
        </TabPanel>
      </Paper>
    </Container>
  );
}
