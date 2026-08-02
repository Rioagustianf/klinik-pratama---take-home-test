import {
  findAllPatients,
  findPatientById,
  findPatientByNik,
  createPatient,
  updatePatient,
  softDeletePatient,
} from '../repositories/patientRepository.js';

export const getPatients = async (query) => {
  return await findAllPatients(query);
};

export const getPatientById = async (id) => {
  const patient = await findPatientById(id);
  if (!patient || patient.deleted_at) {
    const error = new Error('Data pasien tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }
  return patient;
};

export const createNewPatient = async (data) => {
  const existingNik = await findPatientByNik(data.nik.trim());
  if (existingNik) {
    const error = new Error('NIK sudah terdaftar dalam sistem');
    error.statusCode = 409;
    throw error;
  }

  return await createPatient(data);
};

export const updateExistingPatient = async (id, data) => {
  const existing = await findPatientById(id);
  if (!existing || existing.deleted_at) {
    const error = new Error('Data pasien tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  return await updatePatient(id, data);
};

export const softDeleteExistingPatient = async (id) => {
  const existing = await findPatientById(id);
  if (!existing || existing.deleted_at) {
    const error = new Error('Data pasien tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  return await softDeletePatient(id);
};
