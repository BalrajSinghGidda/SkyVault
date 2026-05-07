require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());

// CORS Configuration - Dynamic origin checker
const corsOptions = {
  origin: function (origin, callback) {
    // List of allowed origins for production
    const allowedOrigins = [
      'http://localhost:8000',
      'http://localhost:3000',
      'http://127.0.0.1:8000',
      'http://127.0.0.1:3000',
      'http://localhost',
      'http://127.0.0.1',
    ];

    // Extract hostname from origin (e.g., 'servos' from 'http://servos:8000')
    const extractHostname = (originUrl) => {
      if (!originUrl) return null;
      try {
        const url = new URL(originUrl);
        return url.hostname;
      } catch (e) {
        return null;
      }
    };

    const allowedPorts = ['8000', '3000', '5000']; // Frontend ports

    if (!origin) {
      // Allow requests with no origin (like mobile apps, curl requests)
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      // Exact match
      return callback(null, true);
    }

    // Check if origin is from localhost/127.0.0.1 with common frontend ports
    try {
      const url = new URL(origin);
      const port = url.port || '';
      const hostname = url.hostname;

      // Allow any request from same machine (localhost/127.0.0.1) on frontend ports
      if ((hostname === 'localhost' || hostname === '127.0.0.1') && 
          (allowedPorts.includes(port) || !port)) {
        return callback(null, true);
      }

      // Allow any request from non-localhost hosts with http (for dev environments)
      // This enables custom hostnames like 'servos', 'mycomputer', etc.
      if (url.protocol === 'http:' && 
          hostname !== 'localhost' && 
          hostname !== '127.0.0.1' &&
          allowedPorts.includes(port)) {
        console.log(`✅ CORS: Allowing origin ${origin}`);
        return callback(null, true);
      }

      // For HTTPS in production, be stricter
      if (url.protocol === 'https:') {
        // Only allow if explicitly whitelisted
        return callback(new Error('CORS not allowed'), false);
      }

      // Default deny
      console.warn(`❌ CORS: Blocking origin ${origin}`);
      return callback(new Error('CORS not allowed'), false);
    } catch (e) {
      console.error('CORS origin parsing error:', e);
      return callback(new Error('CORS parsing error'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running ✅' });
});

// API Routes (to be implemented)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/files', require('./routes/files'));
app.use('/api/share', require('./routes/sharing'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Basic frontend routes
app.get('/', (req, res) => {
  res.send('SkyVault Backend Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
