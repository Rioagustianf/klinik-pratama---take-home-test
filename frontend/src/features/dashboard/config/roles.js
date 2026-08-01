import {
  LayoutDashboard,
  Users,
  ClipboardList,
  ListOrdered,
  Stethoscope,
  HeartPulse,
  LogOut,
} from "lucide-react";

export const ROLE = {
  ADMIN: "Admin",
  PETUGAS: "Petugas",
  DOKTER: "Dokter",
};

export const ROLE_LABELS = {
  [ROLE.ADMIN]: {
    label: "Administrator",
    description: "Pengawasan penuh operasional klinik",
    icon: LayoutDashboard,
  },
  [ROLE.PETUGAS]: {
    label: "Petugas Pendaftaran",
    description: "Front-office & pendaftaran pasien",
    icon: ClipboardList,
  },
  [ROLE.DOKTER]: {
    label: "Dokter",
    description: "Pemeriksaan & rekam medis pasien",
    icon: Stethoscope,
  },
};

const NAV_ITEMS = {
  [ROLE.ADMIN]: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/patients", label: "Master Pasien", icon: Users },
    { to: "/registrations", label: "Pendaftaran", icon: ClipboardList },
    { to: "/queues", label: "Antrean", icon: ListOrdered },
  ],
  [ROLE.PETUGAS]: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/patients", label: "Master Pasien", icon: Users },
    { to: "/registrations", label: "Pendaftaran", icon: ClipboardList },
    { to: "/queues", label: "Antrean", icon: ListOrdered },
  ],
  [ROLE.DOKTER]: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/medical-records", label: "Pemeriksaan (SOAP)", icon: Stethoscope },
  ],
};

export const getNavItems = (role) => NAV_ITEMS[role] ?? [];

export const BRAND = {
  name: "Klinik Pratama",
  sub: "Sistem Informasi Klinik",
  icon: HeartPulse,
};

export { LogOut };
