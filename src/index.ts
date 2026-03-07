import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
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
