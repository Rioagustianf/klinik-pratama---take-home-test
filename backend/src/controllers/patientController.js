import { validateCreatePatient, validateUpdatePatient, validatePatientId } from '../validators/patientValidator.js';
import {
  getPatients,
  getPatientById,
  createNewPatient,
  updateExistingPatient,
  softDeleteExistingPatient,
} from '../services/patientService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const listPatients = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
  const search = req.query.search || '';

  const result = await getPatients({ page, limit, search });
  return sendSuccess(res, result, 'Daftar pasien berhasil diambil');
};

export const detailPatient = async (req, res) => {
  const { isValid, errors } = validatePatientId(req.params.id);
  if (!isValid) {
    return sendError(res, 'Validation Error', errors, 400);
  }

  const patient = await getPatientById(req.params.id);
  return sendSuccess(res, patient, 'Detail pasien berhasil diambil');
};

export const createPatient = async (req, res) => {
  const { isValid, errors } = validateCreatePatient(req.body);
  if (!isValid) {
    return sendError(res, 'Validation Error', errors, 400);
  }

  const patient = await createNewPatient(req.body);
  return sendSuccess(res, patient, 'Pasien berhasil ditambahkan', 201);
};

export const updatePatient = async (req, res) => {
  const { isValid, errors } = validatePatientId(req.params.id);
  if (!isValid) {
    return sendError(res, 'Validation Error', errors, 400);
  }

  const { isValid: validUpdate, errors: updateErrors } = validateUpdatePatient(req.body);
  if (!validUpdate) {
    return sendError(res, 'Validation Error', updateErrors, 400);
  }

  const patient = await updateExistingPatient(req.params.id, req.body);
  return sendSuccess(res, patient, 'Data pasien berhasil diperbarui');
};

export const deletePatient = async (req, res) => {
  const { isValid, errors } = validatePatientId(req.params.id);
  if (!isValid) {
    return sendError(res, 'Validation Error', errors, 400);
  }

  await softDeleteExistingPatient(req.params.id);
  return sendSuccess(res, {}, 'Pasien berhasil dihapus (soft delete)');
};