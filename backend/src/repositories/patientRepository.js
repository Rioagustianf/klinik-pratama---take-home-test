import { db } from '../config/db.js';
import { patients } from '../models/schema.js';
import { eq, isNull, like, or, and, sql } from 'drizzle-orm';

const generateNoRM = async () => {
  const result = await db
    .select({ maxId: sql`MAX(CAST(SUBSTRING(no_rm, 3) AS UNSIGNED))` })
    .from(patients)
    .where(isNull(patients.deleted_at));

  const maxId = result[0]?.maxId || 0;
  const nextId = Number(maxId) + 1;
  return `RM${String(nextId).padStart(5, '0')}`;
};

export const findAllPatients = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const searchFilter = search
    ? or(
        like(patients.nama, `%${search}%`),
        like(patients.nik, `%${search}%`),
        like(patients.no_rm, `%${search}%`)
      )
    : undefined;

  const whereClause = searchFilter
    ? and(isNull(patients.deleted_at), searchFilter)
    : isNull(patients.deleted_at);

  const [data, countResult] = await Promise.all([
    db.select().from(patients).where(whereClause).limit(limit).offset(offset),
    db.select({ count: sql`COUNT(*)` }).from(patients).where(whereClause),
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

export const findPatientById = async (id) => {
  const result = await db
    .select()
    .from(patients)
    .where(eq(patients.id, Number(id)))
    .limit(1);

  return result[0] || null;
};

export const findPatientByNik = async (nik) => {
  const result = await db.select().from(patients).where(eq(patients.nik, nik));
  return result[0] || null;
};

export const createPatient = async (data) => {
  const noRM = await generateNoRM();

  const [insertResult] = await db.insert(patients).values({
    no_rm: noRM,
    nik: data.nik.trim(),
    nama: data.nama.trim(),
    jenis_kelamin: data.jenis_kelamin,
    tanggal_lahir: data.tanggal_lahir,
    no_telp: data.no_telp?.trim() || null,
    alamat: data.alamat?.trim() || null,
  });

  const insertedId = insertResult.insertId;
  return await findPatientById(insertedId);
};

export const updatePatient = async (id, data) => {
  const updateData = {};
  if (data.nama !== undefined) updateData.nama = data.nama.trim();
  if (data.jenis_kelamin !== undefined) updateData.jenis_kelamin = data.jenis_kelamin;
  if (data.tanggal_lahir !== undefined) updateData.tanggal_lahir = data.tanggal_lahir;
  if (data.no_telp !== undefined) updateData.no_telp = data.no_telp ? data.no_telp.trim() : null;
  if (data.alamat !== undefined) updateData.alamat = data.alamat ? data.alamat.trim() : null;

  await db
    .update(patients)
    .set(updateData)
    .where(eq(patients.id, Number(id)));

  return await findPatientById(id);
};

export const softDeletePatient = async (id) => {
  await db
    .update(patients)
    .set({ deleted_at: new Date() })
    .where(eq(patients.id, Number(id)));

  return { id: Number(id) };
};
