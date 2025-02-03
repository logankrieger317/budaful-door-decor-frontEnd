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
  target: process.env.BACKEND_URL || 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api', // no rewrite needed, keeping the /api prefix
  },
  onError: (err, req, res) => {
    console.error('Proxy Error:', err);
    res.status(500).json({ message: 'Error connecting to backend service' });
  },
}));

// Serve static files from the React app build directory
app.use(express.static(join(__dirname, 'dist')));

// Handle React routing, return all requests to React app
app.get('*', function(req, res) {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
