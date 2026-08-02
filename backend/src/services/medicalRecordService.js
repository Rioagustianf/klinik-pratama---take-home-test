import {
  findRegistrationById,
  findMedicalRecordByRegistration,
  findMedicalRecordById,
  createMedicalRecordWithDetails,
  findMedicalRecordsByPatientId,
  createPrescription,
  findPrescriptionById,
} from '../repositories/medicalRecordRepository.js';

export const createMedicalRecord = async (data) => {
  // Validasi kunjungan ada (REG -> medical record 1:1, PRD 3.1)
  const registration = await findRegistrationById(data.registration_id);
  if (!registration) {
    const error = new Error('Kunjungan tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  // Cegah duplikat rekam medis (relasi 1:1)
  const existing = await findMedicalRecordByRegistration(data.registration_id);
  if (existing) {
    const error = new Error('Kunjungan ini sudah memiliki rekam medis');
    error.statusCode = 409;
    throw error;
  }

  // Rekam medis hanya boleh dibuat dari kunjungan CheckIn / Pemeriksaan.
  // Setelah submit, status otomatis Selesai (EXM-04).
  if (!['CheckIn', 'Pemeriksaan'].includes(registration.status)) {
    const error = new Error(
      `Kunjungan berstatus ${registration.status} tidak dapat diperiksa`,
    );
    error.statusCode = 400;
    throw error;
  }

  return await createMedicalRecordWithDetails(data);
};

export const getMedicalRecordsByPatientId = async (patientId) => {
  const records = await findMedicalRecordsByPatientId(patientId);
  if (records.length === 0) {
    const error = new Error('Riwayat pemeriksaan tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }
  return records;
};

export const addPrescription = async (data) => {
  // Pastikan rekam medis ada (cek via medical_record_id)
  const existing = await findMedicalRecordById(null, data.medical_record_id);
  if (!existing) {
    const error = new Error('Rekam medis tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  return await createPrescription(data);
};

export const getPrescription = async (id) => {
  const prescription = await findPrescriptionById(id);
  if (!prescription) {
    const error = new Error('Resep tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }
  return prescription;
};