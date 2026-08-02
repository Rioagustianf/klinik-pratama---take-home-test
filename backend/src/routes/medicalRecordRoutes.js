import { Router } from 'express';
import {
  submitMedicalRecord,
  getPatientHistory,
  createNewPrescription,
  getPrescriptionDetail,
} from '../controllers/medicalRecordController.js';
import { verifyJWT, checkRole } from '../middlewares/auth.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

// Dokter: write SOAP + submit rekam medis
router.post('/medical-records', verifyJWT, checkRole(['Dokter']), asyncHandler(submitMedicalRecord));

// Admin & Dokter: baca riwayat per pasien
router.get('/medical-records/:patientId', verifyJWT, checkRole(['Admin', 'Dokter']), asyncHandler(getPatientHistory));

// Dokter: tambah resep manual
router.post('/prescriptions', verifyJWT, checkRole(['Dokter']), asyncHandler(createNewPrescription));

// Admin & Dokter: detail resep
router.get('/prescriptions/:id', verifyJWT, checkRole(['Admin', 'Dokter']), asyncHandler(getPrescriptionDetail));

export default router;