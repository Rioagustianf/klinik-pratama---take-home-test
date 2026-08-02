import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoginPage from '@/features/auth/LoginPage';
import RoleDashboardPage from '@/features/dashboard/pages/RoleDashboardPage';
import PatientsPage from '@/features/patients/pages/PatientsPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes — Semua Role */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<RoleDashboardPage />} />
      </Route>

      {/* Protected Routes — Admin & Petugas */}
      <Route element={<ProtectedRoute allowedRoles={['Admin', 'Petugas']} />}>
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/registrations" element={<div>Pendaftaran Kunjungan</div>} />
        <Route path="/queues" element={<div>Antrean Harian</div>} />
      </Route>

      {/* Protected Routes — Dokter */}
      <Route element={<ProtectedRoute allowedRoles={['Dokter']} />}>
        <Route path="/medical-records" element={<div>Pemeriksaan Dokter (SOAP)</div>} />
      </Route>

      {/* Fallback Routes */}
      <Route path="/unauthorized" element={<div className="p-8 text-center text-[#ba1a1a] font-bold">403 — Akses Ditolak (Peran Tidak Sesuai)</div>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
