import { db, poolConnection } from '../config/db.js';
import { patients } from '../models/schema.js';
import { isNull } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

const generatePatientData = () => {
  const firstNames = ['Budi', 'Siti', 'Andi', 'Rina', 'Wawan', 'Dewi', 'Fitra', 'Nina', 'Deni', 'Maya', 'Agus', 'Lina', 'Doni', 'Tara', 'Eko', 'Sara', 'Hari', 'Intan', 'Joko', 'Wina', 'Rizki', 'Sinta', 'Teguh', 'Novi', 'Fajar', 'Alya', 'Gilang', 'Citra', 'Hendri', 'Putri'];
  const lastNames = ['Santoso', 'Wijaya', 'Pratama', 'Sari', 'Kurniawan', 'Lestari', 'Mulyadi', 'Ningsih', 'Setiawan', 'Rahman', 'Hariyanto', 'Ahmad', 'Iskandar', 'Wibowo', 'Suharto', 'Andriansyah', 'Putra', 'Hidayat', 'Firmansyah', 'Oktavia', 'Gunawan', 'Sukma', 'Nugroho', 'Arianto', 'Halim', 'Yuliani', 'Darsono', 'Saptono', 'Basri', 'Wijayanto'];
  const genders = ['L', 'P'];

  const patientList = [];
  for (let i = 0; i < 30; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[(i * 2) % lastNames.length];
    const gender = genders[i % 2];

    const nik = '35710101' + String(Math.floor(10000000 + i * 379161)).substring(0, 8);

    const year = 1970 + Math.floor(Math.random() * 35);
    const month = 1 + Math.floor(Math.random() * 12);
    const day = 1 + Math.floor(Math.random() * 28);
    const birthDate = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const phone = '08' + String(Math.floor(100000000 + i * 1234567)).substring(0, 10);

    const addresses = [
      'Jl. Merdeka No. 10, Jakarta',
      'Jl. Sudirman No. 45, Jakarta',
      'Jl. Thamrin No. 7, Jakarta',
      'Jl. Gatot Subroto No. 100, Jakarta',
      'Jl. Pegangsaan Timur No. 55, Jakarta',
      'Jl. Cipagalo No. 23, Bandung',
      'Jl. Dago No. 12, Bandung',
      'Jl. Sempaja Selatan No. 8, Medan',
      'Jl. Mongussetan No. 33, Surabaya',
      'Jl. Pahlawan No. 67, Surabaya',
    ];
    const address = addresses[i % addresses.length] + ` RT/RW ${i + 1}/0${i + 1}`;

    patientList.push({
      no_rm: `RM${String(i + 1).padStart(5, '0')}`,
      nik,
      nama: `${firstName} ${lastName}`,
      jenis_kelamin: gender,
      tanggal_lahir: birthDate,
      no_telp: phone,
      alamat: address,
    });
  }

  return patientList;
};

async function seedPatients() {
  console.log('Starting patient seeding...');

  const existing = await db.select().from(patients).where(isNull(patients.deleted_at)).limit(1);

  if (existing.length > 0) {
    console.log(`Patients already exist (${existing.length}+ found), skipping seed.`);
    return;
  }

  const patientData = generatePatientData();
  await db.insert(patients).values(patientData);
  console.log(`Seeded ${patientData.length} patients.`);

  console.log('Patient seeding completed successfully.');
}

seedPatients()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await poolConnection.end();
  });
