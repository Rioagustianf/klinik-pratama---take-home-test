import { Router } from 'express';
import authRoutes from './authRoutes.js';
import patientRoutes from './patientRoutes.js';

const router = Router();

router.use(authRoutes);
router.use(patientRoutes);

export default router;
