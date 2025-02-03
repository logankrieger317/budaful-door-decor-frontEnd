import express from 'express';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Enable gzip compression
app.use(compression());

// Proxy /api requests to the backend
app.use('/api', createProxyMiddleware({
  target: process.env.BACKEND_URL || 'https://budafuldoordecorbackend-production.up.railway.app',
  changeOrigin: true,
  secure: false, // Don't verify SSL cert
  timeout: 30000, // 30 second timeout
  proxyTimeout: 31000, // slightly longer than timeout
  pathRewrite: {
    '^/api': '/api',
  },
  onProxyReq: (proxyReq, req, res) => {
    // Log the outgoing request
    console.log(`Proxying ${req.method} ${req.url} to ${proxyReq.path}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    // Log the response
    console.log(`Received ${proxyRes.statusCode} for ${req.method} ${req.url}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy Error:', err);
    res.status(500).json({ 
      message: 'Error connecting to backend service',
      error: err.message
    });
  },
  logLevel: 'debug',
}));

// Serve static files from the React app build directory
app.use(express.static(join(__dirname, 'dist')));

// Handle React routing, return all requests to React app
app.get('*', function(req, res) {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Proxying API requests to: ${process.env.BACKEND_URL || 'https://budafuldoordecorbackend-production.up.railway.app'}`);
});
