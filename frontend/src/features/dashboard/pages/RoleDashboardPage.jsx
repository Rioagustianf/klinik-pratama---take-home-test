import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ROLE } from "../config/roles";
import DashboardLayout from "../components/DashboardLayout";
import AdminDashboardPage from "./AdminDashboardPage";
import PetugasDashboardPage from "./PetugasDashboardPage";
import DokterDashboardPage from "./DokterDashboardPage";

const ROLE_CONFIG = {
  [ROLE.ADMIN]: {
    title: "Dashboard Administrator",
    subtitle: "Ringkasan operasional klinik hari ini",
    component: AdminDashboardPage,
  },
  [ROLE.PETUGAS]: {
    title: "Dashboard Petugas",
    subtitle: "Pemantauan antrean & pendaftaran hari ini",
    component: PetugasDashboardPage,
  },
  [ROLE.DOKTER]: {
    title: "Dashboard Dokter",
    subtitle: "Antrean pemeriksaan & rekam medis",
    component: DokterDashboardPage,
  },
};

const RoleDashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const config = ROLE_CONFIG[user.role] ?? ROLE_CONFIG[ROLE.ADMIN];
  const Content = config.component;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <DashboardLayout
      title={config.title}
      subtitle={config.subtitle}
      onLogout={handleLogout}
    >
      <Content />
    </DashboardLayout>
  );
};

export default RoleDashboardPage;
