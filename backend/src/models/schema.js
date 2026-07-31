import { mysqlTable, serial, varchar, text, date, timestamp, int, double } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// Tables 

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(), // 'Admin' | 'Dokter' | 'Petugas'
});

export const polies = mysqlTable('polies', {
  id: serial('id').primaryKey(),
  nama_poli: varchar('nama_poli', { length: 255 }).notNull(),
});

export const doctors = mysqlTable('doctors', {
  id: serial('id').primaryKey(),
  user_id: int('user_id').references(() => users.id).unique(),
  nama: varchar('nama', { length: 255 }).notNull(),
  poli_id: int('poli_id').references(() => polies.id).notNull(),
});

export const patients = mysqlTable('patients', {
  id: serial('id').primaryKey(),
  no_rm: varchar('no_rm', { length: 50 }).notNull().unique(),
  nik: varchar('nik', { length: 16 }).notNull().unique(),
  nama: varchar('nama', { length: 255 }).notNull(),
  jenis_kelamin: varchar('jenis_kelamin', { length: 1 }).notNull(), // 'L' | 'P'
  tanggal_lahir: date('tanggal_lahir').notNull(),
  no_telp: varchar('no_telp', { length: 50 }),
  alamat: text('alamat'),
  deleted_at: timestamp('deleted_at'),
});

export const registrations = mysqlTable('registrations', {
  id: serial('id').primaryKey(),
  patient_id: int('patient_id').references(() => patients.id).notNull(),
  doctor_id: int('doctor_id').references(() => doctors.id).notNull(),
  poli_id: int('poli_id').references(() => polies.id).notNull(),
  created_by: int('created_by').references(() => users.id).notNull(),
  tanggal_kunjungan: date('tanggal_kunjungan').notNull(),
  jenis_pembayaran: varchar('jenis_pembayaran', { length: 50 }).notNull(), // 'Umum' | 'BPJS' | 'Asuransi'
  keluhan_awal: text('keluhan_awal'),
  status: varchar('status', { length: 50 }).notNull().default('Menunggu'), // 'Menunggu' | 'CheckIn' | 'Pemeriksaan' | 'Selesai' | 'Batal'
});

export const queues = mysqlTable('queues', {
  id: serial('id').primaryKey(),
  registration_id: int('registration_id').references(() => registrations.id).unique().notNull(),
  nomor_antrean: varchar('nomor_antrean', { length: 10 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  called_at: timestamp('called_at'),
});

export const medicalRecords = mysqlTable('medical_records', {
  id: serial('id').primaryKey(),
  registration_id: int('registration_id').references(() => registrations.id).unique().notNull(),
  subjective: text('subjective'),
  tekanan_darah: varchar('tekanan_darah', { length: 20 }),
  suhu: double('suhu'),
  berat_badan: double('berat_badan'),
  tinggi_badan: double('tinggi_badan'),
  diagnosa: text('diagnosa'),
  rencana_terapi: text('rencana_terapi'),
});

export const prescriptions = mysqlTable('prescriptions', {
  id: serial('id').primaryKey(),
  medical_record_id: int('medical_record_id').references(() => medicalRecords.id).notNull(),
  nama_obat: varchar('nama_obat', { length: 255 }).notNull(),
  dosis: varchar('dosis', { length: 50 }).notNull(),
  aturan_pakai: varchar('aturan_pakai', { length: 255 }).notNull(),
});

export const medicalActions = mysqlTable('medical_actions', {
  id: serial('id').primaryKey(),
  medical_record_id: int('medical_record_id').references(() => medicalRecords.id).notNull(),
  nama_tindakan: varchar('nama_tindakan', { length: 255 }).notNull(),
  catatan: text('catatan'),
});

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many, one }) => ({
  doctor: one(doctors, { fields: [users.id], references: [doctors.user_id] }),
  registrationsCreated: many(registrations),
}));

export const poliesRelations = relations(polies, ({ many }) => ({
  doctors: many(doctors),
  registrations: many(registrations),
}));

export const doctorsRelations = relations(doctors, ({ one, many }) => ({
  userAccount: one(users, { fields: [doctors.user_id], references: [users.id] }),
  poli: one(polies, { fields: [doctors.poli_id], references: [polies.id] }),
  registrations: many(registrations),
}));

export const patientsRelations = relations(patients, ({ many }) => ({
  registrations: many(registrations),
}));

export const registrationsRelations = relations(registrations, ({ one }) => ({
  patient: one(patients, { fields: [registrations.patient_id], references: [patients.id] }),
  doctor: one(doctors, { fields: [registrations.doctor_id], references: [doctors.id] }),
  poli: one(polies, { fields: [registrations.poli_id], references: [polies.id] }),
  creator: one(users, { fields: [registrations.created_by], references: [users.id] }),
  queue: one(queues, { fields: [registrations.id], references: [queues.registration_id] }),
  medicalRecord: one(medicalRecords, { fields: [registrations.id], references: [medicalRecords.registration_id] }),
}));

export const queuesRelations = relations(queues, ({ one }) => ({
  registration: one(registrations, { fields: [queues.registration_id], references: [registrations.id] }),
}));

export const medicalRecordsRelations = relations(medicalRecords, ({ one, many }) => ({
  registration: one(registrations, { fields: [medicalRecords.registration_id], references: [registrations.id] }),
  prescriptions: many(prescriptions),
  actions: many(medicalActions),
}));

export const prescriptionsRelations = relations(prescriptions, ({ one }) => ({
  medicalRecord: one(medicalRecords, { fields: [prescriptions.medical_record_id], references: [medicalRecords.id] }),
}));

export const medicalActionsRelations = relations(medicalActions, ({ one }) => ({
  medicalRecord: one(medicalRecords, { fields: [medicalActions.medical_record_id], references: [medicalRecords.id] }),
}));
