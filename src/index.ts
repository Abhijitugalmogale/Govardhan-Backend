import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL || ""
].filter(Boolean);

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-user-id', 'Authorization']
}));
app.use(express.json());

import cowRoutes from './routes/cows.js';
import milkRoutes from './routes/milk.js';
import financeRoutes from './routes/finance.js';

// Routes
app.use('/api/cows', cowRoutes);
app.use('/api/milk', milkRoutes);
app.use('/api/finance', financeRoutes);

app.get('/', (req, res) => {
    res.send('Dairy Farm Manager API is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
