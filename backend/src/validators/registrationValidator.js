import { eq, isNull } from 'drizzle-orm';

export const REGISTRATION_STATUS_FLOW = ['Menunggu', 'CheckIn', 'Pemeriksaan', 'Selesai', 'Batal'];

export const validateCreateRegistration = (data) => {
  const errors = {};

  if (!data.patient_id || isNaN(Number(data.patient_id)) || Number(data.patient_id) < 1) {
    errors.patient_id = 'Pasien wajib dipilih';
  }

  if (!data.doctor_id || isNaN(Number(data.doctor_id)) || Number(data.doctor_id) < 1) {
    errors.doctor_id = 'Dokter wajib dipilih';
  }

  if (!data.tanggal_kunjungan) {
    errors.tanggal_kunjungan = 'Tanggal kunjungan wajib diisi';
  } else if (typeof data.tanggal_kunjungan !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.tanggal_kunjungan)) {
    errors.tanggal_kunjungan = 'Format tanggal kunjungan harus YYYY-MM-DD';
  }

  if (!data.jenis_pembayaran || !['Umum', 'BPJS', 'Asuransi'].includes(data.jenis_pembayaran)) {
    errors.jenis_pembayaran = 'Jenis pembayaran harus Umum, BPJS, atau Asuransi';
  }

  if (data.keluhan_awal && typeof data.keluhan_awal !== 'string') {
    errors.keluhan_awal = 'Keluhan awal harus berupa string';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateUpdateRegistrationStatus = (data) => {
  const errors = {};

  if (!data.status || !['Menunggu', 'CheckIn', 'Pemeriksaan', 'Selesai', 'Batal'].includes(data.status)) {
    errors.status = 'Status harus salah satu dari: Menunggu, CheckIn, Pemeriksaan, Selesai, Batal';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateRegistrationId = (id) => {
  const errors = {};

  if (!id || isNaN(Number(id)) || Number(id) < 1) {
    errors.id = 'ID registrasi harus berupa angka positif';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const canTransition = (from, to) => {
  if (from === to) return true;
  if (to === 'CheckIn' && from === 'Menunggu') return true;
  if (to === 'Pemeriksaan' && from === 'CheckIn') return true;
  if (to === 'Selesai' && from === 'Pemeriksaan') return true;
  if (to === 'Batal' && (from === 'Menunggu' || from === 'CheckIn')) return true;

  return false;
};