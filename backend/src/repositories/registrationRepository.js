import { db } from '../config/db.js';
import {
  registrations,
  queues,
  patients,
  doctors,
  polies,
} from '../models/schema.js';
import { eq, and, sql, like, or } from 'drizzle-orm';


const generateQueueNumber = async (tx, tanggalKunjungan) => {
  const result = await tx
    .select({
      maxNum: sql`MAX(CAST(SUBSTRING(${queues.nomor_antrean}, 2) AS UNSIGNED))`,
    })
    .from(queues)
    .innerJoin(registrations, eq(queues.registration_id, registrations.id))
    .where(eq(registrations.tanggal_kunjungan, tanggalKunjungan));

  const maxNum = result[0]?.maxNum || 0;
  const nextNum = Number(maxNum) + 1;
  return `A${String(nextNum).padStart(3, '0')}`;
};

export const findAllRegistrations = async ({
  page = 1,
  limit = 10,
  tanggal,
  status,
  search = '',
}) => {
  const offset = (page - 1) * limit;

  const conditions = [];
  if (tanggal) conditions.push(eq(registrations.tanggal_kunjungan, tanggal));
  if (status) conditions.push(eq(registrations.status, status));
  if (search) {
    conditions.push(
      or(
        like(patients.nama, `%${search}%`),
        like(patients.nik, `%${search}%`),
        like(doctors.nama, `%${search}%`),
      ),
    );
  }
  const whereClause = conditions.length ? and(...conditions) : undefined;

  const [data, countResult] = await Promise.all([
    db
      .select({
        id: registrations.id,
        patient_id: registrations.patient_id,
        doctor_id: registrations.doctor_id,
        poli_id: registrations.poli_id,
        created_by: registrations.created_by,
        tanggal_kunjungan: registrations.tanggal_kunjungan,
        jenis_pembayaran: registrations.jenis_pembayaran,
        keluhan_awal: registrations.keluhan_awal,
        status: registrations.status,
        patient: {
          id: patients.id,
          no_rm: patients.no_rm,
          nik: patients.nik,
          nama: patients.nama,
        },
        doctor: {
          id: doctors.id,
          nama: doctors.nama,
          poli: {
            id: polies.id,
            nama_poli: polies.nama_poli,
          },
        },
        queue: {
          id: queues.id,
          nomor_antrean: queues.nomor_antrean,
          status: queues.status,
        },
      })
      .from(registrations)
      .leftJoin(patients, eq(registrations.patient_id, patients.id))
      .leftJoin(doctors, eq(registrations.doctor_id, doctors.id))
      .leftJoin(polies, eq(doctors.poli_id, polies.id))
      .leftJoin(queues, eq(queues.registration_id, registrations.id))
      .where(whereClause)
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql`COUNT(*)` })
      .from(registrations)
      .where(whereClause),
  ]);

  const total = Number(countResult[0].count);
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

export const findRegistrationById = async (id) => {
  const result = await db
    .select({
      id: registrations.id,
      patient_id: registrations.patient_id,
      doctor_id: registrations.doctor_id,
      poli_id: registrations.poli_id,
      created_by: registrations.created_by,
      tanggal_kunjungan: registrations.tanggal_kunjungan,
      jenis_pembayaran: registrations.jenis_pembayaran,
      keluhan_awal: registrations.keluhan_awal,
      status: registrations.status,
      patient: {
        id: patients.id,
        no_rm: patients.no_rm,
        nik: patients.nik,
        nama: patients.nama,
      },
      doctor: {
        id: doctors.id,
        nama: doctors.nama,
        poli: {
          id: polies.id,
          nama_poli: polies.nama_poli,
        },
      },
      queue: {
        id: queues.id,
        nomor_antrean: queues.nomor_antrean,
        status: queues.status,
        called_at: queues.called_at,
      },
    })
    .from(registrations)
    .leftJoin(patients, eq(registrations.patient_id, patients.id))
    .leftJoin(doctors, eq(registrations.doctor_id, doctors.id))
    .leftJoin(polies, eq(doctors.poli_id, polies.id))
    .leftJoin(queues, eq(queues.registration_id, registrations.id))
    .where(eq(registrations.id, Number(id)))
    .limit(1);

  return result[0] || null;
};

export const findPatientById = async (id) => {
  const result = await db
    .select()
    .from(patients)
    .where(and(eq(patients.id, Number(id)), sql`${patients.deleted_at} IS NULL`))
    .limit(1);
  return result[0] || null;
};

export const findDoctorById = async (id) => {
  const result = await db
    .select()
    .from(doctors)
    .where(eq(doctors.id, Number(id)))
    .limit(1);
  return result[0] || null;
};

export const findAllDoctors = async () => {
  const result = await db
    .select({
      id: doctors.id,
      nama: doctors.nama,
      poli: {
        id: polies.id,
        nama_poli: polies.nama_poli,
      },
    })
    .from(doctors)
    .leftJoin(polies, eq(doctors.poli_id, polies.id));
  return result;
};


export const findActiveRegistration = async ({ patient_id, doctor_id, tanggal_kunjungan }) => {
  const result = await db
    .select()
    .from(registrations)
    .where(
      and(
        eq(registrations.patient_id, Number(patient_id)),
        eq(registrations.doctor_id, Number(doctor_id)),
        eq(registrations.tanggal_kunjungan, tanggal_kunjungan),
        sql`${registrations.status} NOT IN ('Batal', 'Selesai')`,
      ),
    )
    .limit(1);
  return result[0] || null;
};

export const createRegistrationWithQueue = async (data, createdBy) => {

  const doctor = await findDoctorById(data.doctor_id);
  if (!doctor) {
    const error = new Error('Dokter tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  return await db.transaction(async (tx) => {
    const [regResult] = await tx.insert(registrations).values({
      patient_id: data.patient_id,
      doctor_id: data.doctor_id,
      poli_id: doctor.poli_id,
      created_by: createdBy,
      tanggal_kunjungan: data.tanggal_kunjungan,
      jenis_pembayaran: data.jenis_pembayaran,
      keluhan_awal: data.keluhan_awal || null,
      status: 'Menunggu',
    });

    const registrationId = regResult.insertId;
    const nomorAntrean = await generateQueueNumber(tx, data.tanggal_kunjungan);

    await tx.insert(queues).values({
      registration_id: registrationId,
      nomor_antrean: nomorAntrean,
      status: 'Menunggu',
      called_at: null,
    });

    const [created] = await tx
      .select({
        id: registrations.id,
        patient_id: registrations.patient_id,
        doctor_id: registrations.doctor_id,
        poli_id: registrations.poli_id,
        created_by: registrations.created_by,
        tanggal_kunjungan: registrations.tanggal_kunjungan,
        jenis_pembayaran: registrations.jenis_pembayaran,
        keluhan_awal: registrations.keluhan_awal,
        status: registrations.status,
        patient: {
          id: patients.id,
          no_rm: patients.no_rm,
          nik: patients.nik,
          nama: patients.nama,
        },
        doctor: {
          id: doctors.id,
          nama: doctors.nama,
          poli: {
            id: polies.id,
            nama_poli: polies.nama_poli,
          },
        },
        queue: {
          id: queues.id,
          nomor_antrean: queues.nomor_antrean,
          status: queues.status,
          called_at: queues.called_at,
        },
      })
      .from(registrations)
      .leftJoin(patients, eq(registrations.patient_id, patients.id))
      .leftJoin(doctors, eq(registrations.doctor_id, doctors.id))
      .leftJoin(polies, eq(doctors.poli_id, polies.id))
      .leftJoin(queues, eq(queues.registration_id, registrations.id))
      .where(eq(registrations.id, registrationId))
      .limit(1);

    return created;
  });
};


export const updateRegistrationStatus = async (id, newStatus) => {
  return await db.transaction(async (tx) => {
    await tx
      .update(registrations)
      .set({ status: newStatus })
      .where(eq(registrations.id, Number(id)));

    await tx
      .update(queues)
      .set({ status: newStatus })
      .where(eq(queues.registration_id, Number(id)));

    return await findRegistrationById(id);
  });
};

export const findAllQueues = async () => {
  const today = new Date().toISOString().split('T')[0];

  const result = await db
    .select({
      id: queues.id,
      registration_id: queues.registration_id,
      nomor_antrean: queues.nomor_antrean,
      status: queues.status,
      called_at: queues.called_at,
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
    .from(queues)
    .innerJoin(registrations, eq(queues.registration_id, registrations.id))
    .innerJoin(patients, eq(registrations.patient_id, patients.id))
    .innerJoin(doctors, eq(registrations.doctor_id, doctors.id))
    .where(eq(registrations.tanggal_kunjungan, today))
    .orderBy(sql`CAST(SUBSTRING(${queues.nomor_antrean}, 2) AS UNSIGNED)`);

  return result;
};

export const findQueueById = async (id, conn) => {
  const executor = conn || db;
  const result = await executor
    .select({
      id: queues.id,
      registration_id: queues.registration_id,
      nomor_antrean: queues.nomor_antrean,
      status: queues.status,
      called_at: queues.called_at,
      registration: {
        id: registrations.id,
        status: registrations.status,
        patient: {
          id: patients.id,
          nama: patients.nama,
        },
      },
    })
    .from(queues)
    .innerJoin(registrations, eq(queues.registration_id, registrations.id))
    .innerJoin(patients, eq(registrations.patient_id, patients.id))
    .where(eq(queues.id, Number(id)))
    .limit(1);

  return result[0] || null;
};

export const callQueue = async (id) => {
  const queue = await findQueueById(id);
  if (!queue) {
    const error = new Error('Antrean tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  return await db.transaction(async (tx) => {
    await tx
      .update(queues)
      .set({ status: 'CheckIn', called_at: new Date() })
      .where(eq(queues.id, Number(id)));

    await tx
      .update(registrations)
      .set({ status: 'CheckIn' })
      .where(eq(registrations.id, queue.registration_id));

    return await findQueueById(id, tx);
  });
};

export const updateQueueStatus = async (id, newStatus) => {
  const queue = await findQueueById(id);
  if (!queue) {
    const error = new Error('Antrean tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  return await db.transaction(async (tx) => {
    await tx
      .update(queues)
      .set({ status: newStatus })
      .where(eq(queues.id, Number(id)));

    await tx
      .update(registrations)
      .set({ status: newStatus })
      .where(eq(registrations.id, queue.registration_id));

    return await findQueueById(id, tx);
  });
};