import { Router } from 'express';
import authRoutes from './authRoutes.js';
import patientRoutes from './patientRoutes.js';
import registrationRoutes from './registrationRoutes.js';

const router = Router();

router.use(authRoutes);
router.use(patientRoutes);
router.use(registrationRoutes);

export default router;
