import {
  validateCreateMedicalRecord,
  validateCreatePrescription,
  validateId,
} from '../validators/medicalRecordValidator.js';
import {
  createMedicalRecord,
  getMedicalRecordsByPatientId,
  addPrescription,
  getPrescription,
} from '../services/medicalRecordService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const submitMedicalRecord = async (req, res) => {
  const { isValid, errors } = validateCreateMedicalRecord(req.body);
  if (!isValid) {
    return sendError(res, 'Validation Error', errors, 400);
  }

  const medicalRecord = await createMedicalRecord(req.body);
  return sendSuccess(res, medicalRecord, 'Rekam medis berhasil disimpan', 201);
};

export const getPatientHistory = async (req, res) => {
  const { isValid, errors } = validateId(req.params.patientId, 'patientId');
  if (!isValid) {
    return sendError(res, 'Validation Error', errors, 400);
  }

  const records = await getMedicalRecordsByPatientId(req.params.patientId);
  return sendSuccess(res, records, 'Riwayat pemeriksaan berhasil diambil');
};

export const createNewPrescription = async (req, res) => {
  const { isValid, errors } = validateCreatePrescription(req.body);
  if (!isValid) {
    return sendError(res, 'Validation Error', errors, 400);
  }

  const prescription = await addPrescription(req.body);
  return sendSuccess(res, prescription, 'Resep obat berhasil ditambahkan', 201);
};

export const getPrescriptionDetail = async (req, res) => {
  const { isValid, errors } = validateId(req.params.id);
  if (!isValid) {
    return sendError(res, 'Validation Error', errors, 400);
  }

  const prescription = await getPrescription(req.params.id);
  return sendSuccess(res, prescription, 'Detail resep berhasil diambil');
};