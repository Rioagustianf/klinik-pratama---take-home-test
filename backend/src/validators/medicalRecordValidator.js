export const validateCreateMedicalRecord = (data) => {
  const errors = {};

  if (!data.registration_id || isNaN(Number(data.registration_id)) || Number(data.registration_id) < 1) {
    errors.registration_id = 'ID kunjungan wajib diisi';
  }

  if (data.subjective !== undefined && typeof data.subjective !== 'string') {
    errors.subjective = 'Subjective harus berupa string';
  }

  if (data.tekanan_darah !== undefined && typeof data.tekanan_darah !== 'string') {
    errors.tekanan_darah = 'Tekanan darah harus berupa string (contoh: 120/80)';
  }

  if (data.suhu !== undefined && (isNaN(Number(data.suhu)) || Number(data.suhu) < 0)) {
    errors.suhu = 'Suhu tubuh harus berupa angka positif';
  }

  if (data.berat_badan !== undefined && (isNaN(Number(data.berat_badan)) || Number(data.berat_badan) < 0)) {
    errors.berat_badan = 'Berat badan harus berupa angka positif';
  }

  if (data.tinggi_badan !== undefined && (isNaN(Number(data.tinggi_badan)) || Number(data.tinggi_badan) < 0)) {
    errors.tinggi_badan = 'Tinggi badan harus berupa angka positif';
  }

  if (data.diagnosa !== undefined && typeof data.diagnosa !== 'string') {
    errors.diagnosa = 'Diagnosa harus berupa string';
  }

  if (data.rencana_terapi !== undefined && typeof data.rencana_terapi !== 'string') {
    errors.rencana_terapi = 'Rencana terapi harus berupa string';
  }

  // Tindakan medis (opsional, array)
  if (data.tindakan !== undefined) {
    if (!Array.isArray(data.tindakan)) {
      errors.tindakan = 'Tindakan harus berupa array';
    } else {
      const tindakanErrors = [];
      data.tindakan.forEach((t, i) => {
        const itemErrors = {};
        if (!t.nama_tindakan || typeof t.nama_tindakan !== 'string') {
          itemErrors.nama_tindakan = 'Nama tindakan wajib diisi';
        }
        if (t.catatan !== undefined && typeof t.catatan !== 'string') {
          itemErrors.catatan = 'Catatan harus berupa string';
        }
        tindakanErrors[i] = itemErrors;
      });
      if (tindakanErrors.some((e) => Object.keys(e).length > 0)) {
        errors.tindakan = tindakanErrors;
      }
    }
  }

  // Resep obat (opsional, array)
  if (data.resep !== undefined) {
    if (!Array.isArray(data.resep)) {
      errors.resep = 'Resep harus berupa array';
    } else {
      const resepErrors = [];
      data.resep.forEach((r, i) => {
        const itemErrors = {};
        if (!r.nama_obat || typeof r.nama_obat !== 'string') {
          itemErrors.nama_obat = 'Nama obat wajib diisi';
        }
        if (!r.dosis || typeof r.dosis !== 'string') {
          itemErrors.dosis = 'Dosis wajib diisi';
        }
        if (!r.aturan_pakai || typeof r.aturan_pakai !== 'string') {
          itemErrors.aturan_pakai = 'Aturan pakai wajib diisi';
        }
        resepErrors[i] = itemErrors;
      });
      if (resepErrors.some((e) => Object.keys(e).length > 0)) {
        errors.resep = resepErrors;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateCreatePrescription = (data) => {
  const errors = {};

  if (!data.medical_record_id || isNaN(Number(data.medical_record_id)) || Number(data.medical_record_id) < 1) {
    errors.medical_record_id = 'ID rekam medis wajib diisi';
  }

  if (!data.nama_obat || typeof data.nama_obat !== 'string') {
    errors.nama_obat = 'Nama obat wajib diisi';
  }

  if (!data.dosis || typeof data.dosis !== 'string') {
    errors.dosis = 'Dosis wajib diisi';
  }

  if (!data.aturan_pakai || typeof data.aturan_pakai !== 'string') {
    errors.aturan_pakai = 'Aturan pakai wajib diisi';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateId = (id, field = 'id') => {
  const errors = {};
  if (!id || isNaN(Number(id)) || Number(id) < 1) {
    errors[field] = `ID ${field} harus berupa angka positif`;
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};