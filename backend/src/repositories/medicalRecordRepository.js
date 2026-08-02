import { db } from '../config/db.js';
import {
  registrations,
  queues,
  patients,
  doctors,
  polies,
  medicalRecords,
  prescriptions,
  medicalActions,
} from '../models/schema.js';
import { eq, and, sql, desc, isNull } from 'drizzle-orm';

export const findRegistrationById = async (id) => {
  const result = await db
    .select({
      id: registrations.id,
      patient_id: registrations.patient_id,
      doctor_id: registrations.doctor_id,
      poli_id: registrations.poli_id,
      status: registrations.status,
      patient: {
        id: patients.id,
        no_rm: patients.no_rm,
        nik: patients.nik,
        nama: patients.nama,
        jenis_kelamin: patients.jenis_kelamin,
        tanggal_lahir: patients.tanggal_lahir,
      },
      doctor: {
        id: doctors.id,
        nama: doctors.nama,
        poli: {
          id: polies.id,
          nama_poli: polies.nama_poli,
        },
      },
    })
    .from(registrations)
    .innerJoin(patients, eq(registrations.patient_id, patients.id))
    .innerJoin(doctors, eq(registrations.doctor_id, doctors.id))
    .innerJoin(polies, eq(doctors.poli_id, polies.id))
    .where(and(eq(registrations.id, Number(id)), isNull(patients.deleted_at)))
    .limit(1);

  return result[0] || null;
};

// Cek apakah kunjungan sudah punya rekam medis (relasi 1:1, PRD 3.1)
export const findMedicalRecordByRegistration = async (registrationId) => {
  const result = await db
    .select()
    .from(medicalRecords)
    .where(eq(medicalRecords.registration_id, Number(registrationId)))
    .limit(1);

  return result[0] || null;
};

// Buat rekam medis + tindakan + resep dalam satu transaksi,
// lalu ubah status kunjungan & antrean menjadi Selesai (EXM-04).
export const createMedicalRecordWithDetails = async (data) => {
  return await db.transaction(async (tx) => {
    const [mrResult] = await tx.insert(medicalRecords).values({
      registration_id: data.registration_id,
      subjective: data.subjective || null,
      tekanan_darah: data.tekanan_darah || null,
      suhu: data.suhu !== undefined ? data.suhu : null,
      berat_badan: data.berat_badan !== undefined ? data.berat_badan : null,
      tinggi_badan: data.tinggi_badan !== undefined ? data.tinggi_badan : null,
      diagnosa: data.diagnosa || null,
      rencana_terapi: data.rencana_terapi || null,
    });

    const medicalRecordId = mrResult.insertId;

    if (data.tindakan && data.tindakan.length > 0) {
      await tx.insert(medicalActions).values(
        data.tindakan.map((t) => ({
          medical_record_id: medicalRecordId,
          nama_tindakan: t.nama_tindakan,
          catatan: t.catatan || null,
        })),
      );
    }

    if (data.resep && data.resep.length > 0) {
      await tx.insert(prescriptions).values(
        data.resep.map((r) => ({
          medical_record_id: medicalRecordId,
          nama_obat: r.nama_obat,
          dosis: r.dosis,
          aturan_pakai: r.aturan_pakai,
        })),
      );
    }

    // Set status kunjungan & antrean -> Selesai (EXM-04)
    await tx
      .update(registrations)
      .set({ status: 'Selesai' })
      .where(eq(registrations.id, Number(data.registration_id)));

    await tx
      .update(queues)
      .set({ status: 'Selesai' })
      .where(eq(queues.registration_id, Number(data.registration_id)));

    return await findMedicalRecordById(tx, medicalRecordId);
  });
};

// Query prescriptions & actions sebagai array (EXM-03, 1-to-many).
const findPrescriptionsByMedicalRecord = async (conn, medicalRecordId) => {
  const executor = conn || db;
  const result = await executor
    .select({
      id: prescriptions.id,
      nama_obat: prescriptions.nama_obat,
      dosis: prescriptions.dosis,
      aturan_pakai: prescriptions.aturan_pakai,
    })
    .from(prescriptions)
    .where(eq(prescriptions.medical_record_id, Number(medicalRecordId)));

  return result;
};

const findActionsByMedicalRecord = async (conn, medicalRecordId) => {
  const executor = conn || db;
  const result = await executor
    .select({
      id: medicalActions.id,
      nama_tindakan: medicalActions.nama_tindakan,
      catatan: medicalActions.catatan,
    })
    .from(medicalActions)
    .where(eq(medicalActions.medical_record_id, Number(medicalRecordId)));

  return result;
};

export const findMedicalRecordById = async (conn, id) => {
  const executor = conn || db;
  const [record] = await executor
    .select({
      id: medicalRecords.id,
      registration_id: medicalRecords.registration_id,
      subjective: medicalRecords.subjective,
      tekanan_darah: medicalRecords.tekanan_darah,
      suhu: medicalRecords.suhu,
      berat_badan: medicalRecords.berat_badan,
      tinggi_badan: medicalRecords.tinggi_badan,
      diagnosa: medicalRecords.diagnosa,
      rencana_terapi: medicalRecords.rencana_terapi,
      registration: {
        id: registrations.id,
        status: registrations.status,
        patient: {
          id: patients.id,
          no_rm: patients.no_rm,
          nama: patients.nama,
        },
        doctor: {
          id: doctors.id,
          nama: doctors.nama,
        },
      },
    })
    .from(medicalRecords)
    .innerJoin(registrations, eq(medicalRecords.registration_id, registrations.id))
    .innerJoin(patients, eq(registrations.patient_id, patients.id))
    .innerJoin(doctors, eq(registrations.doctor_id, doctors.id))
    .where(eq(medicalRecords.id, Number(id)))
    .limit(1);

  if (!record) return null;

  const [prescriptionsList, actionsList] = await Promise.all([
    findPrescriptionsByMedicalRecord(conn, record.id),
    findActionsByMedicalRecord(conn, record.id),
  ]);

  return {
    ...record,
    prescriptions: prescriptionsList,
    actions: actionsList,
  };
};

// Riwayat rekam medis per pasien, descending (EXM-05)
export const findMedicalRecordsByPatientId = async (patientId) => {
  const records = await db
    .select({
      id: medicalRecords.id,
      registration_id: medicalRecords.registration_id,
      subjective: medicalRecords.subjective,
      tekanan_darah: medicalRecords.tekanan_darah,
      suhu: medicalRecords.suhu,
      berat_badan: medicalRecords.berat_badan,
      tinggi_badan: medicalRecords.tinggi_badan,
      diagnosa: medicalRecords.diagnosa,
      rencana_terapi: medicalRecords.rencana_terapi,
      tanggal_kunjungan: registrations.tanggal_kunjungan,
      doctor: {
        id: doctors.id,
        nama: doctors.nama,
      },
      poli: {
        id: polies.id,
        nama_poli: polies.nama_poli,
      },
    })
    .from(medicalRecords)
    .innerJoin(registrations, eq(medicalRecords.registration_id, registrations.id))
    .innerJoin(doctors, eq(registrations.doctor_id, doctors.id))
    .innerJoin(polies, eq(doctors.poli_id, polies.id))
    .where(eq(registrations.patient_id, Number(patientId)))
    .orderBy(desc(registrations.tanggal_kunjungan));

  // Ambil prescriptions & actions per record (hindari join 1-to-many yang duplikat)
  const withDetails = await Promise.all(
    records.map(async (record) => {
      const [prescriptionsList, actionsList] = await Promise.all([
        findPrescriptionsByMedicalRecord(db, record.id),
        findActionsByMedicalRecord(db, record.id),
      ]);
      return {
        ...record,
        prescriptions: prescriptionsList,
        actions: actionsList,
      };
    }),
  );

  return withDetails;
};

export const createPrescription = async (data) => {
  const [result] = await db.insert(prescriptions).values({
    medical_record_id: data.medical_record_id,
    nama_obat: data.nama_obat,
    dosis: data.dosis,
    aturan_pakai: data.aturan_pakai,
  });

  const prescriptionId = result.insertId;
  const [prescription] = await db
    .select()
    .from(prescriptions)
    .where(eq(prescriptions.id, prescriptionId))
    .limit(1);

  return prescription;
};

export const findPrescriptionById = async (id) => {
  const result = await db
    .select()
    .from(prescriptions)
    .where(eq(prescriptions.id, Number(id)))
    .limit(1);

  return result[0] || null;
};