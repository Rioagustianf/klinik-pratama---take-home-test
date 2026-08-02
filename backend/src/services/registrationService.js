import {
  findAllRegistrations,
  findRegistrationById,
  findPatientById,
  findActiveRegistration,
  createRegistrationWithQueue,
  updateRegistrationStatus,
  findAllQueues,
  findAllDoctors,
  callQueue,
  updateQueueStatus,
} from '../repositories/registrationRepository.js';
import { canTransition } from '../validators/registrationValidator.js';

export const getRegistrations = async (query) => {
  return await findAllRegistrations(query);
};

export const getDoctors = async () => {
  return await findAllDoctors();
};

export const getRegistrationById = async (id) => {
  const registration = await findRegistrationById(id);
  if (!registration) {
    const error = new Error('Kunjungan tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }
  return registration;
};

export const createNewRegistration = async (data, createdBy) => {
  const patient = await findPatientById(data.patient_id);
  if (!patient) {
    const error = new Error('Pasien tidak ditemukan atau sudah non-aktif');
    error.statusCode = 404;
    throw error;
  }

  const duplicate = await findActiveRegistration(data);
  if (duplicate) {
    const error = new Error(
      'Pasien sudah terdaftar untuk dokter dan tanggal kunjungan ini',
    );
    error.statusCode = 409;
    throw error;
  }

  return await createRegistrationWithQueue(data, createdBy);
};

export const updateRegistrationStatusService = async (id, newStatus) => {
  const registration = await getRegistrationById(id);

  if (!canTransition(registration.status, newStatus)) {
    const error = new Error(
      `Transisi status tidak valid: ${registration.status} -> ${newStatus}`,
    );
    error.statusCode = 400;
    throw error;
  }

  return await updateRegistrationStatus(id, newStatus);
};

export const getQueues = async () => {
  return await findAllQueues();
};

export const callNextQueue = async (id) => {
  return await callQueue(id);
};

export const updateQueueStatusService = async (id, newStatus) => {
  return await updateQueueStatus(id, newStatus);
};