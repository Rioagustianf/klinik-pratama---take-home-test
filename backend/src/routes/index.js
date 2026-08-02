import { Router } from 'express';
import authRoutes from './authRoutes.js';
import patientRoutes from './patientRoutes.js';
import registrationRoutes from './registrationRoutes.js';
import medicalRecordRoutes from './medicalRecordRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = Router();

router.use(authRoutes);
router.use(patientRoutes);
router.use(registrationRoutes);
router.use(medicalRecordRoutes);
router.use(dashboardRoutes);

export default router;
