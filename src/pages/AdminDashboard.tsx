import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Collapse,
  Select,
  MenuItem,
  FormControl,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardActions,
  useTheme,
  useMediaQuery,
  Chip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import api from "../config/api";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface OrderItem {
  id: string;
  quantity: number;
  priceAtTime: number;
  Product: {
    name: string;
    sku: string;
  };
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  phone?: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  deletedAt: string | null;
  shippingAddress: string;
  billingAddress: string;
  notes?: string;
  items: OrderItem[];
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

const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
const PAYMENT_STATUSES = ["pending", "completed", "failed", "refunded"];

type SortField =
  | "id"
  | "customerName"
  | "contact"
  | "totalAmount"
  | "status"
  | "paymentStatus"
  | "createdAt"
  | "deletedAt";
type SortDirection = "asc" | "desc";

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function OrderRow({
  order,
  onOrderUpdate,
  onOrderDelete,
  onOrderRestore,
  isMobile,
  showDeleted,
}: {
  order: Order;
  onOrderUpdate: (orderId: string, updates: any) => Promise<void>;
  onOrderDelete: (orderId: string) => Promise<void>;
  onOrderRestore: (orderId: string) => Promise<void>;
  isMobile: boolean;
  showDeleted: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleStatusChange = async (
    field: "status" | "paymentStatus",
    value: string
  ) => {
    setLoading(true);
    try {
      await onOrderUpdate(order.id, { [field]: value });
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await onOrderDelete(order.id);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting order:", error);
      setDeleteDialogOpen(false);
    }
  };

  const handleRestore = async () => {
    try {
      await onOrderRestore(order.id);
    } catch (error) {
      console.error("Error restoring order:", error);
    }
  };

  if (isMobile) {
    return (
      <>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                Order #{order.id}
              </Typography>
              <Typography variant="subtitle2">
                {new Date(order.createdAt).toLocaleDateString()}
              </Typography>
            </Box>

            <Typography variant="h6" gutterBottom>
              {order.customerName}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {order.customerEmail}
              </Typography>
              {order.phone && (
                <Typography variant="body2" color="text.secondary">
                  {order.phone}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
              <Chip
                label={`$${parseFloat(order.totalAmount.toString()).toFixed(
                  2
                )}`}
                color="primary"
                variant="outlined"
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={order.status}
                  onChange={(e) => handleStatusChange("status", e.target.value)}
                  disabled={loading}
                >
                  {ORDER_STATUSES.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={order.paymentStatus}
                  onChange={(e) =>
                    handleStatusChange("paymentStatus", e.target.value)
                  }
                  disabled={loading}
                >
                  {PAYMENT_STATUSES.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Button
                size="small"
                onClick={() => setOpen(!open)}
                startIcon={
                  open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
                }
              >
                {open ? "Hide" : "Show"} Order Details
              </Button>
            </Box>

            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Order Items:
                </Typography>
                {order.items?.map((item) => (
                  <Box key={item.id} sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      {item.Product.name} (SKU: {item.Product.sku})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.quantity} x $
                      {parseFloat(item.priceAtTime.toString()).toFixed(2)} = $
                      {(
                        item.quantity * parseFloat(item.priceAtTime.toString())
                      ).toFixed(2)}
                    </Typography>
                  </Box>
                ))}

                <Typography variant="subtitle2" sx={{ mt: 2 }} gutterBottom>
                  Shipping Address:
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                  {order.shippingAddress}
                </Typography>

                <Typography variant="subtitle2" sx={{ mt: 2 }} gutterBottom>
                  Billing Address:
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                  {order.billingAddress}
                </Typography>

                {order.notes && (
                  <>
                    <Typography variant="subtitle2" sx={{ mt: 2 }} gutterBottom>
                      Notes:
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                      {order.notes}
                    </Typography>
                  </>
                )}
              </Box>
            </Collapse>
          </CardContent>
          <CardActions>
            {order.deletedAt ? (
              <Button
                size="small"
                color="primary"
                onClick={handleRestore}
                startIcon={<EditIcon />}
              >
                Restore Order
              </Button>
            ) : (
              <Button
                size="small"
                color="error"
                onClick={() => setDeleteDialogOpen(true)}
                startIcon={<DeleteIcon />}
              >
                Delete Order
              </Button>
            )}
          </CardActions>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          aria-labelledby="delete-dialog-title"
        >
          <DialogTitle id="delete-dialog-title">
            Confirm Delete Order
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete order #{order.id}? This action
              cannot be undone.
            </Typography>
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              All order information including customer details and order items
              will be permanently deleted.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete Order
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{order.id}</TableCell>
        <TableCell>{order.customerName}</TableCell>
        <TableCell>
          <div>{order.customerEmail}</div>
          {order.phone && (
            <div style={{ color: "gray", fontSize: "0.9em" }}>
              {order.phone}
            </div>
          )}
        </TableCell>
        <TableCell>
          ${parseFloat(order.totalAmount.toString()).toFixed(2)}
        </TableCell>
        <TableCell>
          <FormControl size="small" fullWidth disabled={loading}>
            <Select
              value={order.status}
              onChange={(e) => handleStatusChange("status", e.target.value)}
            >
              {ORDER_STATUSES.map((status) => (
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
              onChange={(e) =>
                handleStatusChange("paymentStatus", e.target.value)
              }
            >
              {PAYMENT_STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </TableCell>
        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
        {showDeleted && (
          <TableCell>
            {order.deletedAt ? (
              <Typography variant="body2" color="error">
                {new Date(order.deletedAt).toLocaleDateString()}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                -
              </Typography>
            )}
          </TableCell>
        )}
        <TableCell>
          {order.deletedAt ? (
            <Button
              size="small"
              color="primary"
              onClick={handleRestore}
              startIcon={<EditIcon />}
            >
              Restore Order
            </Button>
          ) : (
            <IconButton
              aria-label="delete order"
              size="small"
              onClick={() => setDeleteDialogOpen(true)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          )}
        </TableCell>
      </TableRow>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete Order</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete order #{order.id}? This action
            cannot be undone.
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            All order information including customer details and order items
            will be permanently deleted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* Expanded Order Details */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Shipping Address
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {order.shippingAddress}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Billing Address
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {order.billingAddress}
                  </Typography>
                </Grid>
                {order.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Notes
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ whiteSpace: "pre-line" }}
                    >
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
                  {order.items?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.Product.name}</TableCell>
                      <TableCell>{item.Product.sku}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">
                        ${parseFloat(item.priceAtTime.toString()).toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        $
                        {(
                          item.quantity *
                          parseFloat(item.priceAtTime.toString())
                        ).toFixed(2)}
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tab, setTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  // Filter orders based on status
  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "all") return true;
    return order.status === statusFilter;
  });

  // Sort the filtered orders
  const sortedOrders = filteredOrders.sort((a, b) => {
    let compareA: string | number;
    let compareB: string | number;

    switch (sortField) {
      case "id":
        compareA = a.id;
        compareB = b.id;
        break;
      case "customerName":
        compareA = a.customerName.toLowerCase();
        compareB = b.customerName.toLowerCase();
        break;
      case "contact":
        compareA = (a.customerEmail + (a.phone || "")).toLowerCase();
        compareB = (b.customerEmail + (b.phone || "")).toLowerCase();
        break;
      case "totalAmount":
        compareA = a.totalAmount;
        compareB = b.totalAmount;
        break;
      case "status":
        compareA = a.status.toLowerCase();
        compareB = b.status.toLowerCase();
        break;
      case "paymentStatus":
        compareA = a.paymentStatus.toLowerCase();
        compareB = b.paymentStatus.toLowerCase();
        break;
      case "createdAt":
        compareA = new Date(a.createdAt).getTime();
        compareB = new Date(b.createdAt).getTime();
        break;
      case "deletedAt":
        compareA = a.deletedAt ? new Date(a.deletedAt).getTime() : 0;
        compareB = b.deletedAt ? new Date(b.deletedAt).getTime() : 0;
        break;
      default:
        return 0;
    }

    if (compareA < compareB) return sortDirection === "asc" ? -1 : 1;
    if (compareA > compareB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleStatusTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setStatusFilter(newValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          api.get<Order[]>(`/api/admin/orders?showDeleted=${showDeleted}`),
          api.get<Product[]>("/api/admin/products"),
        ]);

        setOrders(ordersRes.data);
        setProducts(productsRes.data);
        setError("");
      } catch (error: any) {
        console.error("Error fetching data:", error);
        if (error?.response?.status === 401) {
          localStorage.removeItem("adminToken");
          navigate("/admin/login");
        } else {
          setError(
            error?.response?.data?.message || "Error loading dashboard data"
          );
        }
      }
    };

    fetchData();
  }, [navigate, showDeleted]);

  const handleOrderUpdate = async (orderId: string, updates: any) => {
    try {
      const response = await api.put(`/api/admin/orders/${orderId}`, updates);
      setOrders(
        orders.map((order) => (order.id === orderId ? response.data : order))
      );
      setError("");
    } catch (error: any) {
      console.error("Error updating order:", error);
      if (error?.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      }
      throw error;
    }
  };

  const handleOrderDelete = async (orderId: string) => {
    try {
      await api.delete(`/api/admin/orders/${orderId}`);
      setOrders(orders.filter((order) => order.id !== orderId));
      showSnackbar("Order marked as deleted", "success");
    } catch (error: any) {
      console.error("Error deleting order:", error);
      if (error?.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      } else {
        showSnackbar(
          error?.response?.data?.message || "Error deleting order",
          "error"
        );
      }
    }
  };

  const handleOrderRestore = async (orderId: string) => {
    try {
      const response = await api.post(`/api/admin/orders/${orderId}/restore`);
      setOrders(orders.map((order) => (order.id === orderId ? response.data : order)));
      showSnackbar("Order restored successfully", "success");
    } catch (error: any) {
      console.error("Error restoring order:", error);
      if (error?.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      } else {
        showSnackbar(
          error?.response?.data?.message || "Error restoring order",
          "error"
        );
      }
    }
  };

  const handleDeleteProduct = async (sku: string) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await api.delete(`/api/admin/products/${sku}`);
      setProducts(products.filter((p) => p.sku !== sku));
      setError("");
    } catch (error: any) {
      console.error("Error deleting product:", error);
      if (error?.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      } else {
        setError(error?.response?.data?.message || "Error deleting product");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  return (
    <Container maxWidth={false}>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" component="h1">
            Admin Dashboard
          </Typography>
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/admin/products/new")}
              sx={{ mr: 2 }}
            >
              Add Product
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ width: "100%", mb: 2 }}>
          <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
            <Tab label={`Orders (${orders.length})`} />
            <Tab label={`Products (${products.length})`} />
          </Tabs>

          <TabPanel value={tab} index={0}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
              <Tabs
                value={statusFilter}
                onChange={handleStatusTabChange}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons={isMobile ? "auto" : false}
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "capitalize",
                  },
                }}
              >
                <Tab label="All Orders" value="all" />
                <Tab label="Processing" value="processing" />
                <Tab label="Shipped" value="shipped" />
                <Tab label="Delivered" value="delivered" />
                <Tab label="Cancelled" value="cancelled" />
              </Tabs>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, flexWrap: "wrap", gap: 1 }}>
              <Typography variant="h5" component="h1" gutterBottom={isMobile}>
                Orders {statusFilter !== "all" ? `- ${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}` : ""}
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={showDeleted}
                    onChange={(e) => setShowDeleted(e.target.checked)}
                  />
                }
                label="Show Deleted Orders"
              />
            </Box>

            {isMobile ? (
              sortedOrders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  onOrderUpdate={handleOrderUpdate}
                  onOrderDelete={handleOrderDelete}
                  onOrderRestore={handleOrderRestore}
                  isMobile={true}
                  showDeleted={showDeleted}
                />
              ))
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell>Order Number</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Payment</TableCell>
                      <TableCell>Date</TableCell>
                      {showDeleted && (
                        <TableCell>Deleted At</TableCell>
                      )}
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedOrders.map((order) => (
                      <OrderRow
                        key={order.id}
                        order={order}
                        onOrderUpdate={handleOrderUpdate}
                        onOrderDelete={handleOrderDelete}
                        onOrderRestore={handleOrderRestore}
                        isMobile={false}
                        showDeleted={showDeleted}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
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
                      <TableCell>
                        ${parseFloat(product.price.toString()).toFixed(2)}
                      </TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() =>
                            navigate(`/admin/products/${product.sku}/edit`)
                          }
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
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Paper>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminDashboard;
