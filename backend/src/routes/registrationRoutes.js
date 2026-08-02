import { Router } from 'express';
import {
  listDoctors,
  listRegistrations,
  detailRegistration,
  createRegistration,
  updateRegistrationStatus,
  listQueues,
  callNextQueue,
  updateQueueStatus,
} from '../controllers/registrationController.js';
import { verifyJWT, checkRole } from '../middlewares/auth.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.get('/doctors', verifyJWT, checkRole(['Admin', 'Petugas', 'Dokter']), asyncHandler(listDoctors));

router.get('/registrations', verifyJWT, checkRole(['Admin', 'Petugas', 'Dokter']), asyncHandler(listRegistrations));
router.get('/registrations/:id', verifyJWT, checkRole(['Admin', 'Petugas', 'Dokter']), asyncHandler(detailRegistration));

router.post('/registrations', verifyJWT, checkRole(['Admin', 'Petugas']), asyncHandler(createRegistration));
router.put('/registrations/:id', verifyJWT, checkRole(['Admin', 'Petugas']), asyncHandler(updateRegistrationStatus));

router.get('/queues', verifyJWT, checkRole(['Admin', 'Petugas', 'Dokter']), asyncHandler(listQueues));
router.put('/queues/:id/call', verifyJWT, checkRole(['Admin', 'Petugas', 'Dokter']), asyncHandler(callNextQueue));
router.put('/queues/:id/status', verifyJWT, checkRole(['Admin', 'Petugas', 'Dokter']), asyncHandler(updateQueueStatus));

export default router;