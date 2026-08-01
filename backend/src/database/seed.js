import { db, poolConnection } from '../config/db.js';
import { users, polies, doctors } from '../models/schema.js';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('Starting database seeding...');

  try {
    console.log('Inserting Polies...');
    const existingPolies = await db.select().from(polies);
    if (existingPolies.length === 0) {
      await db.insert(polies).values([
        { nama_poli: 'Poli Umum' },
        { nama_poli: 'Poli Gigi' }
      ]);
      console.log('Polies seeded.');
    } else {
      console.log('Polies already exist, skipping.');
    }

    const allPolies = await db.select().from(polies);
    const poliUmum = allPolies.find((p) => p.nama_poli === 'Poli Umum') || allPolies[0];

    console.log('Inserting Users...');
    const saltRounds = 10;
    const adminPasswordHash = await bcrypt.hash('admin123', saltRounds);
    const petugasPasswordHash = await bcrypt.hash('petugas123', saltRounds);
    const dokterPasswordHash = await bcrypt.hash('dokter123', saltRounds);

    const userSeedData = [
      {
        name: 'Administrator Klinik',
        email: 'admin@klinikpratama.com',
        password: adminPasswordHash,
        role: 'Admin'
      },
      {
        name: 'Petugas Pendaftaran',
        email: 'petugas@klinikpratama.com',
        password: petugasPasswordHash,
        role: 'Petugas'
      },
      {
        name: 'dr. Ahmad Ridwan, Sp.PD',
        email: 'dokter@klinikpratama.com',
        password: dokterPasswordHash,
        role: 'Dokter'
      }
    ];

    for (const userData of userSeedData) {
      const existing = await db.select().from(users).where(eq(users.email, userData.email));
      if (existing.length === 0) {
        await db.insert(users).values(userData);
        console.log(`Seeded user: ${userData.email}`);
      } else {
        console.log(`User ${userData.email} already exists, skipping.`);
      }
    }

    console.log('Linking Doctor Data...');
    const [dokterUser] = await db.select().from(users).where(eq(users.email, 'dokter@klinikpratama.com'));

    if (dokterUser) {
      const existingDoctor = await db.select().from(doctors).where(eq(doctors.user_id, dokterUser.id));
      if (existingDoctor.length === 0) {
        await db.insert(doctors).values({
          user_id: dokterUser.id,
          nama: 'dr. Ahmad Ridwan, Sp.PD',
          poli_id: poliUmum.id
        });
        console.log('Seeded Doctor profile for dr. Ahmad Ridwan.');
      } else {
        console.log('Doctor profile already exists, skipping.');
      }
    }

    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await poolConnection.end();
  }
}

seed();
