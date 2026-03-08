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
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-user-id', 'Authorization']
}));
// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log(`  Origin: ${req.get('origin') || 'no origin'}`);
    console.log(`  User ID: ${req.get('x-user-id') || 'not provided'}`);
    next();
});
app.use(express.json());
// Health check endpoint (no auth required)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
// API routes (test endpoint)
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'API is running',
        frontend_url: process.env.FRONTEND_URL || 'not set',
        user_id: req.headers['x-user-id'] || 'not provided'
    });
});
import cowRoutes from './routes/cows.js';
import milkRoutes from './routes/milk.js';
import financeRoutes from './routes/finance.js';
// Routes
app.use('/api/cows', cowRoutes);
app.use('/api/milk', milkRoutes);
app.use('/api/finance', financeRoutes);
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Dairy Farm Manager API is running',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            apiHealth: '/api/health',
            cows: '/api/cows',
            milk: '/api/milk',
            finance: '/api/finance'
        }
    });
});
// 404 handler
app.use((req, res) => {
    console.warn(`404 - ${req.method} ${req.path} not found`);
    res.status(404).json({
        message: 'Endpoint not found',
        path: req.path,
        method: req.method,
        availableEndpoints: {
            health: '/health',
            apiHealth: '/api/health',
            cows: '/api/cows',
            milk: '/api/milk',
            finance: '/api/finance'
        }
    });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
