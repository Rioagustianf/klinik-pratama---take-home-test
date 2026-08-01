import {
  Users,
  UserPlus,
  ListOrdered,
  Clock,
  CheckCircle2,
} from "lucide-react";
import StatCard from "../components/StatCard";
import DashboardSection from "../components/DashboardSection";

const metrics = [
  {
    id: "total",
    label: "Total Pasien Terdaftar",
    value: 1284,
    description: "Keseluruhan pasien dalam sistem (PRD DSH-01)",
    icon: Users,
    tone: "primary",
  },
  {
    id: "baru",
    label: "Pasien Baru Hari Ini",
    value: 42,
    description: "Terdaftar pada hari berjalan (PRD DSH-02)",
    icon: UserPlus,
    tone: "success",
  },
  {
    id: "antrean",
    label: "Total Antrean Hari Ini",
    value: 98,
    description: "Nomor antrean digenerate hari ini (PRD DSH-03)",
    icon: ListOrdered,
    tone: "secondary",
  },
  {
    id: "menunggu",
    label: "Antrean Menunggu",
    value: 24,
    description: "Status Menunggu / Check In (PRD DSH-04)",
    icon: Clock,
    tone: "warning",
  },
  {
    id: "selesai",
    label: "Kunjungan Selesai",
    value: 56,
    description: "Kunjungan selesai hari ini (PRD DSH-05)",
    icon: CheckCircle2,
    tone: "destructive",
  },
];

const AdminDashboardPage = () => {
  return (
    <>
      <DashboardSection
        title="Ringkasan Operasional"
        description="Indikator kinerja utama klinik pada hari berjalan"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric) => (
            <StatCard key={metric.id} {...metric} />
          ))}
        </div>
      </DashboardSection>

      <DashboardSection
        title="Aktivitas Terbaru"
        description="Gambaran singkat aktivitas klinik hari ini"
      >
        <div className="rounded-[16px] border border-line bg-white p-6 shadow-[0_4px_12px_rgba(15,110,110,0.05)]">
          <p className="text-sm leading-6 text-ink-muted">
            Grafik dan log aktivitas akan ditampilkan di sini pada fase
            integrasi backend (modul pendaftaran, antrean, dan pemeriksaan).
          </p>
        </div>
      </DashboardSection>
    </>
  );
};

export default AdminDashboardPage;
