export const validateCreatePatient = (data) => {
  const errors = {};

  if (!data.nik || typeof data.nik !== 'string' || data.nik.trim().length !== 16) {
    errors.nik = 'NIK wajib diisi dan harus 16 digit';
  }

  if (!data.nama || typeof data.nama !== 'string' || !data.nama.trim()) {
    errors.nama = 'Nama pasien wajib diisi';
  }

  if (!data.jenis_kelamin || !['L', 'P'].includes(data.jenis_kelamin)) {
    errors.jenis_kelamin = 'Jenis kelamin wajib diisi (L atau P)';
  }

  if (!data.tanggal_lahir) {
    errors.tanggal_lahir = 'Tanggal lahir wajib diisi';
  }

  if (data.no_telp && typeof data.no_telp !== 'string') {
    errors.no_telp = 'Nomor telepon harus berupa string';
  }

  if (data.alamat && typeof data.alamat !== 'string') {
    errors.alamat = 'Alamat harus berupa string';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateUpdatePatient = (data) => {
  const errors = {};

  if (data.nik !== undefined) {
    errors.nik = 'NIK tidak dapat diubah (read-only)';
  }

  if (data.no_rm !== undefined) {
    errors.no_rm = 'No. RM tidak dapat diubah (read-only)';
  }

  if (data.jenis_kelamin !== undefined && !['L', 'P'].includes(data.jenis_kelamin)) {
    errors.jenis_kelamin = 'Jenis kelamin harus L atau P';
  }

  if (data.tanggal_lahir !== undefined && typeof data.tanggal_lahir !== 'string') {
    errors.tanggal_lahir = 'Tanggal lahir harus berupa string';
  }

  if (data.no_telp !== undefined && typeof data.no_telp !== 'string') {
    errors.no_telp = 'Nomor telepon harus berupa string';
  }

  if (data.alamat !== undefined && typeof data.alamat !== 'string') {
    errors.alamat = 'Alamat harus berupa string';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validatePatientId = (id) => {
  const errors = {};

  if (!id || isNaN(Number(id)) || Number(id) < 1) {
    errors.id = 'ID pasien harus berupa angka positif';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};