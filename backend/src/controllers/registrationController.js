import {
  validateCreateRegistration,
  validateUpdateRegistrationStatus,
  validateRegistrationId,
} from '../validators/registrationValidator.js';
import {
  getRegistrations,
  getRegistrationById,
  getDoctors,
  createNewRegistration,
  updateRegistrationStatusService,
  getQueues,
  callNextQueue as callNextQueueService,
  updateQueueStatusService,
} from '../services/registrationService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const listRegistrations = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
  const tanggal = req.query.tanggal || undefined;
  const status = req.query.status || undefined;
  const search = req.query.search || '';

  const result = await getRegistrations({ page, limit, tanggal, status, search });
  return sendSuccess(res, result, 'Daftar kunjungan berhasil diambil');
};

export const listDoctors = async (req, res) => {
  const doctors = await getDoctors();
  return sendSuccess(res, doctors, 'Daftar dokter berhasil diambil');
};

export const detailRegistration = async (req, res) => {
  const { isValid, errors } = validateRegistrationId(req.params.id);
  if (!isValid) {
    return sendError(res, 'Validation Error', errors, 400);
  }

  const registration = await getRegistrationById(req.params.id);
  return sendSuccess(res, registration, 'Detail kunjungan berhasil diambil');
};

export const createRegistration = async (req, res) => {
  const { isValid, errors } = validateCreateRegistration(req.body);
  if (!isValid) {
    return sendError(res, 'Validation Error', errors, 400);
  }

  const createdBy = req.user?.id;

  const registration = await createNewRegistration(req.body, createdBy);
  return sendSuccess(res, registration, 'Kunjungan berhasil didaftarkan', 201);
};

export const updateRegistrationStatus = async (req, res) => {
  const { isValid, errors } = validateRegistrationId(req.params.id);
  if (!isValid) {
    return sendError(res, 'Validation Error', errors, 400);
  }

  const { isValid: validStatus, errors: statusErrors } =
    validateUpdateRegistrationStatus(req.body);
  if (!validStatus) {
    return sendError(res, 'Validation Error', statusErrors, 400);
  }

  const registration = await updateRegistrationStatusService(
    req.params.id,
    req.body.status,
  );
  return sendSuccess(res, registration, 'Status kunjungan berhasil diperbarui');
};

export const listQueues = async (req, res) => {
  const queues = await getQueues();
  return sendSuccess(res, queues, 'Daftar antrean berhasil diambil');
};

export const callNextQueue = async (req, res) => {
  const { isValid, errors } = validateRegistrationId(req.params.id);
  if (!isValid) {
    return sendError(res, 'Validation Error', errors, 400);
  }

  const queue = await callNextQueueService(req.params.id);
  return sendSuccess(res, queue, 'Antrean berhasil dipanggil');
};

export const updateQueueStatus = async (req, res) => {
  const { isValid, errors } = validateRegistrationId(req.params.id);
  if (!isValid) {
    return sendError(res, 'Validation Error', errors, 400);
  }

  const { isValid: validStatus, errors: statusErrors } =
    validateUpdateRegistrationStatus(req.body);
  if (!validStatus) {
    return sendError(res, 'Validation Error', statusErrors, 400);
  }

  const queue = await updateQueueStatusService(req.params.id, req.body.status);
  return sendSuccess(res, queue, 'Status antrean berhasil diperbarui');
};