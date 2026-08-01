import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get('/', (_req, res) => {
  res.json({ success: true, message: 'Klinik Pratama API is running' });
});

// API Routes
app.use('/api', router);

// Global Error Handler (must have exactly 4 params for Express to recognize it)
app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});

export default app;
