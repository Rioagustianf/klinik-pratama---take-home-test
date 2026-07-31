import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';

// Pages — will be created per feature in Fase 1+
// import LoginPage from '@/features/auth/LoginPage';
// import DashboardPage from '@/features/dashboard/DashboardPage';
// import PatientsPage from '@/features/patients/PatientsPage';
// import RegistrationsPage from '@/features/registrations/RegistrationsPage';
// import QueuesPage from '@/features/queues/QueuesPage';
// import MedicalRecordsPage from '@/features/medical-records/MedicalRecordsPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      {/* <Route path="/login" element={<LoginPage />} /> */}
      <Route path="/login" element={<div>Login Page — coming soon</div>} />

      {/* Protected — semua role */}
      <Route element={<ProtectedRoute />}>
        {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
        <Route path="/dashboard" element={<div>Dashboard — coming soon</div>} />
      </Route>

      {/* Protected — Admin & Petugas */}
      <Route element={<ProtectedRoute allowedRoles={['Admin', 'Petugas']} />}>
        {/* <Route path="/patients" element={<PatientsPage />} /> */}
        {/* <Route path="/registrations" element={<RegistrationsPage />} /> */}
        {/* <Route path="/queues" element={<QueuesPage />} /> */}
      </Route>

      {/* Protected — Dokter */}
      <Route element={<ProtectedRoute allowedRoles={['Dokter']} />}>
        {/* <Route path="/medical-records" element={<MedicalRecordsPage />} /> */}
      </Route>

      {/* Fallback */}
      <Route path="/unauthorized" element={<div>403 — Akses ditolak</div>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
