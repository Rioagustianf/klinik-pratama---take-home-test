# Sistem Informasi Klinik Pratama

Aplikasi **Mini Clinic Information System** berbasis web untuk membantu administrasi dan pelayanan pasien secara terintegrasi: **Pendaftaran Pasien → Antrean Harian → Pemeriksaan Dokter (SOAP) → Pencatatan Resep & Tindakan**, dilengkapi Dashboard Operasional real-time.

Dibangun untuk memenuhi *Technical Assignment — Take Home Test Programmer*.

---

## 📋 Daftar Isi

1. [Teknologi](#teknologi)
2. [Struktur Project](#struktur-project)
3. [Cara Instalasi](#cara-instalasi)
4. [Cara Menjalankan](#cara-menjalankan)
5. [Migrasi & Seeding Database](#migrasi--seeding-database)
6. [Akun Login Dummy](#akun-login-dummy)
7. [Konfigurasi File .env](#konfigurasi-file-env)
8. [Endpoint API](#endpoint-api)
9. [Asumsi Bisnis](#asumsi-bisnis)

---

## Teknologi

| Komponen | Teknologi |
|---|---|
| **Frontend** | React.js (Vite), Tailwind CSS, shadcn/ui, TanStack Query, React Hook Form, Zod, Recharts |
| **Backend** | Node.js, Express.js, Drizzle ORM |
| **Database** | MySQL |
| **Authentication** | JSON Web Token (JWT) |
| **Version Control** | Git |

---

## Struktur Project

```
Klinik Pratama/
├── backend/                     # REST API (Express.js)
│   ├── src/
│   │   ├── app.js               # Inisialisasi Express + middleware global
│   │   ├── server.js            # Entry point server
│   │   ├── config/              # Konfigurasi DB & env
│   │   ├── controllers/         # Layer HTTP (request/response)
│   │   ├── services/            # Layer business logic
│   │   ├── repositories/        # Layer akses data (query DB)
│   │   ├── models/              # Skema Drizzle ORM
│   │   ├── middlewares/         # Auth (JWT) & error handler
│   │   ├── routes/              # Definisi endpoint + RBAC
│   │   ├── validators/          # Validasi input request
│   │   ├── utils/               # Helper (response, asyncHandler, date)
│   │   └── database/            # Script seed
│   ├── drizzle.config.js        # Konfigurasi Drizzle Kit
│   ├── .env.example             # Template env backend
│   └── package.json
│
├── frontend/                    # SPA (React + Vite)
│   └── src/
│       ├── features/            # Feature-based architecture
│       │   ├── auth/            # Login, autentikasi
│       │   ├── dashboard/       # Dashboard KPI per role
│       │   ├── patients/        # Master data pasien
│       │   ├── registrations/   # Pendaftaran kunjungan
│       │   ├── queues/          # Manajemen antrean
│       │   └── medical-records/ # Pemeriksaan SOAP & riwayat
│       ├── components/ui/       # Komponen shadcn/ui
│       ├── components/          # Komponen shared (ProtectedRoute)
│       ├── context/             # AuthContext
│       ├── hooks/               # Hooks shared
│       ├── lib/                 # axios instance, utils (cn, date)
│       ├── routes/              # Routing + Route Guard
│       └── ...
│   ├── .env.example             # Template env frontend
│   └── package.json
│
├── PRD_Klinik_Pratama.md        # Product Requirements Document
├── Klinik_Pratama.postman_collection.json  # Koleksi API Postman
└── README.md                    # Dokumen ini
```

---

## Cara Instalasi

### Prasyarat
- **Node.js** v18+ (disarankan v20+)
- **MySQL** (lokal atau server)
- **npm** (bawaan Node.js)

### 1. Clone Repository
```bash
git clone https://github.com/Rioagustianf/klinik-pratama---take-home-test.git
cd klinik-pratama---take-home-test
```

### 2. Instal Dependensi Backend
```bash
cd backend
npm install
```

### 3. Instal Dependensi Frontend
```bash
cd ../frontend
npm install
```

---

## Cara Menjalankan

### 1. Konfigurasi Environment

Salin file `.env.example` menjadi `.env` pada masing-masing folder, lalu sesuaikan isinya (lihat [Konfigurasi File .env](#konfigurasi-file-env)).

**Backend:**
```bash
cd backend
cp .env.example .env   # lalu edit isi .env
```

**Frontend:**
```bash
cd frontend
cp .env.example .env   # lalu edit isi .env
```

### 2. Setup Database

Pastikan MySQL berjalan, lalu buat database (lihat [Migrasi & Seeding](#migrasi--seeding-database)).

### 3. Jalankan Backend

```bash
cd backend
npm run dev      # mode development (auto-reload via nodemon)
# atau
npm start        # mode production
```

Server berjalan di `http://localhost:5000`.

### 4. Jalankan Frontend

```bash
cd frontend
npm run dev
```

Aplikasi berjalan di `http://localhost:5173`.

---

## Migrasi & Seeding Database

Proyek ini menggunakan **Drizzle ORM** dengan skema deklaratif di `backend/src/models/schema.js`.

### 1. Buat Database

```sql
CREATE DATABASE klinik_pratama CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Push Skema ke Database

```bash
cd backend
npm run db:push
```

Perintah ini membuat/memperbarui tabel berdasarkan skema (tanpa file migrasi terpisah).

### 3. Seed Data Awal

```bash
npm run db:seed
```

Perintah ini menjalankan dua seed sekaligus:
- `seed.js` — data master: Poli, User (3 role), dan profil Dokter
- `seedPatients.js` — 30 data pasien dummy (dengan No. RM otomatis & tanggal daftar bervariasi)



## Akun Login Dummy

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@klinikpratama.com` | `admin123` |
| **Petugas Pendaftaran** | `petugas@klinikpratama.com` | `petugas123` |
| **Dokter** | `dokter@klinikpratama.com` | `dokter123` |

**Matriks Hak Akses (ringkas):**

| Modul | Admin | Petugas | Dokter |
|---|---|---|---|
| Master Pasien (CRUD) | ✅ | ✅ | Baca saja |
| Pendaftaran Kunjungan | ✅ | ✅ | Baca |
| Manajemen Antrean (Call/Status) | ✅ | ✅ | ✅ |
| Pemeriksaan SOAP (tulis) | — | — | ✅ |
| Riwayat Rekam Medis (baca) | ✅ | — | ✅ |
| Dashboard Operasional | ✅ | ✅ | — |

---

## Konfigurasi File .env

### Backend — `backend/.env`

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
# Jika MySQL tidak ada password, hapus baris DB_PASSWORD atau kosongkan
DB_PASSWORD=your_mysql_password
DB_NAME=klinik_pratama
DB_PORT=3306
JWT_SECRET=your_jwt_secret_key_here
```

| Variabel | Keterangan |
|---|---|
| `PORT` | Port server backend (default 5000) |
| `DB_HOST` | Host database MySQL |
| `DB_USER` | Username MySQL |
| `DB_PASSWORD` | Password MySQL |
| `DB_NAME` | Nama database |
| `DB_PORT` | Port MySQL (default 3306) |
| `JWT_SECRET` | Secret key untuk menandatangani JWT — **wajib diubah** |

### Frontend — `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

| Variabel | Keterangan |
|---|---|
| `VITE_API_URL` | Base URL API backend |



## Endpoint API

Kontrak API lengkap tersedia di file **`Klinik_Pratama.postman_collection.json`**. Ringkasan endpoint:

### Authentication
| Method | Route | Akses |
|---|---|---|
| POST | `/api/login` | Publik |
| POST | `/api/logout` | Semua role |

### Patient
| Method | Route | Akses |
|---|---|---|
| GET | `/api/patients` | Admin, Petugas, Dokter |
| GET | `/api/patients/:id` | Admin, Petugas, Dokter |
| POST | `/api/patients` | Admin, Petugas |
| PUT | `/api/patients/:id` | Admin, Petugas |
| DELETE | `/api/patients/:id` | Admin, Petugas |

### Registration & Queue
| Method | Route | Akses |
|---|---|---|
| GET | `/api/registrations` | Admin, Petugas, Dokter |
| POST | `/api/registrations` | Admin, Petugas |
| PUT | `/api/registrations/:id` | Admin, Petugas |
| GET | `/api/doctors` | Admin, Petugas, Dokter |
| GET | `/api/queues` | Admin, Petugas, Dokter |
| PUT | `/api/queues/:id/call` | Admin, Petugas, Dokter |
| PUT | `/api/queues/:id/status` | Admin, Petugas, Dokter |

### Medical Record & Prescription
| Method | Route | Akses |
|---|---|---|
| POST | `/api/medical-records` | Dokter |
| GET | `/api/medical-records/:patientId` | Admin, Dokter |
| POST | `/api/prescriptions` | Dokter |
| GET | `/api/prescriptions/:id` | Admin, Dokter |

### Dashboard
| Method | Route | Akses |
|---|---|---|
| GET | `/api/dashboard` | Admin, Petugas |

---

## Asumsi Bisnis

1. **Relasi 1:1:1 (PRD 3.1)** — Satu Pendaftaran Kunjungan hanya memicu satu Antrean dan menghasilkan satu Rekam Medis.
2. **Nomor Antrean** — Format sekuensial `A001`, `A002`, dst. Dihitung per `tanggal_kunjungan`, sehingga otomatis "reset" setiap hari (tidak memerlukan job scheduler).
3. **Status Kunjungan** — Mengikuti state machine ketat: `Menunggu → CheckIn → Pemeriksaan → Selesai`. Pembatalan (`Batal`) hanya diperbolehkan dari status `Menunggu`/`CheckIn`.
4. **Sumber Kebenaran Status** — Tabel `queues` menjadi sumber kebenaran. Perubahan status antrean otomatis menyinkronkan status registrasi (dan sebaliknya), menjaga konsistensi dua arah.
5. **No. RM & NIK read-only** — Setelah pasien disimpan, No. RM dan NIK tidak dapat diubah (menjaga konsistensi data historis).
6. **Data Dokter & Poli Statis** — Dokter dan Poli disediakan via database seeding (bukan CRUD dinamis) sesuai PRD 3.3. Poli pasien ditentukan otomatis dari penempatan dokter.
7. **Rekam Medis Final** — Sekali disimpan, rekam medis SOAP tidak dapat diubah/dihapus, dan otomatis mengubah status kunjungan menjadi `Selesai`.
8. **RBAC** — Petugas dilarang melihat detail riwayat medis; Dokter tidak dapat mengakses dashboard operasional (sesuai matriks otorisasi PRD).
