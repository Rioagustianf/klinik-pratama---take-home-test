import { db } from '../config/db.js';
import {
  patients,
  registrations,
  queues,
} from '../models/schema.js';
import { eq, and, sql, isNull } from 'drizzle-orm';
import { getTodayLocal } from '../utils/date.js';

// DSH-01: Total pasien terdaftar (yang belum soft-delete)
const countTotalPatients = async () => {
  const [result] = await db
    .select({ count: sql`COUNT(*)` })
    .from(patients)
    .where(isNull(patients.deleted_at));

  return Number(result.count) || 0;
};

// DSH-02: Total pasien baru yang didaftarkan hari ini (dari created_at)
const countNewPatientsToday = async () => {
  const today = getTodayLocal();
  const [result] = await db
    .select({ count: sql`COUNT(*)` })
    .from(patients)
    .where(
      and(
        isNull(patients.deleted_at),
        sql`DATE(${patients.created_at}) = ${today}`,
      ),
    );

  return Number(result.count) || 0;
};

// DSH-03: Total nomor antrean yang digenerate hari ini
const countQueuesToday = async () => {
  const today = getTodayLocal();
  const [result] = await db
    .select({ count: sql`COUNT(*)` })
    .from(queues)
    .innerJoin(registrations, eq(queues.registration_id, registrations.id))
    .where(eq(registrations.tanggal_kunjungan, today));

  return Number(result.count) || 0;
};

// DSH-04: Antrean aktif berstatus Menunggu / CheckIn hari ini
const countActiveQueuesToday = async () => {
  const today = getTodayLocal();
  const [result] = await db
    .select({ count: sql`COUNT(*)` })
    .from(queues)
    .innerJoin(registrations, eq(queues.registration_id, registrations.id))
    .where(
      and(
        eq(registrations.tanggal_kunjungan, today),
        sql`${queues.status} IN ('Menunggu', 'CheckIn')`,
      ),
    );

  return Number(result.count) || 0;
};

// DSH-05: Kunjungan yang berhasil diselesaikan hari ini
const countCompletedToday = async () => {
  const today = getTodayLocal();
  const [result] = await db
    .select({ count: sql`COUNT(*)` })
    .from(registrations)
    .where(
      and(
        eq(registrations.tanggal_kunjungan, today),
        eq(registrations.status, 'Selesai'),
      ),
    );

  return Number(result.count) || 0;
};

export const getDashboardStats = async () => {
  const [totalPatients, newPatientsToday, queuesToday, activeQueues, completed] =
    await Promise.all([
      countTotalPatients(),
      countNewPatientsToday(),
      countQueuesToday(),
      countActiveQueuesToday(),
      countCompletedToday(),
    ]);

  return {
    total_patients: totalPatients,
    new_patients_today: newPatientsToday,
    queues_today: queuesToday,
    active_queues: activeQueues,
    completed_today: completed,
  };
};