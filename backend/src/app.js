import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use(router);

// Health Check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Klinik Pratama API is running' });
});

// Global Error Handler
app.use(errorHandler);

export default app;
