import { Router } from 'express';
import { getDashboard } from '../controllers/dashboardController.js';
import { verifyJWT, checkRole } from '../middlewares/auth.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.get(
  '/dashboard',
  verifyJWT,
  checkRole(['Admin', 'Petugas']),
  asyncHandler(getDashboard)
);

export default router;