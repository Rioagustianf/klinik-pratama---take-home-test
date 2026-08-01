import { UserPlus, ListOrdered, Clock, CheckCircle2 } from "lucide-react";
import StatCard from "../components/StatCard";
import DashboardSection from "../components/DashboardSection";

const metrics = [
  {
    id: "baru",
    label: "Pasien Baru Hari Ini",
    value: 42,
    description: "Pasien baru yang Anda daftarkan hari ini (PRD DSH-02)",
    icon: UserPlus,
    tone: "success",
  },
  {
    id: "antrean",
    label: "Total Antrean Hari Ini",
    value: 98,
    description: "Nomor antrean digenerate hari ini (PRD DSH-03)",
    icon: ListOrdered,
    tone: "primary",
  },
  {
    id: "menunggu",
    label: "Antrean Menunggu",
    value: 24,
    description: "Menunggu / Check In untuk koordinasi loket (PRD DSH-04)",
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

const PetugasDashboardPage = () => {
  return (
    <>
      <DashboardSection
        title="Ringkasan Operasional"
        description="Pemantauan antrean & pendaftaran hari berjalan"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <StatCard key={metric.id} {...metric} />
          ))}
        </div>
      </DashboardSection>

      <DashboardSection
        title="Antrean Hari Ini"
        description="Daftar antrean aktif yang perlu ditindaklanjuti"
      >
        <div className="rounded-[16px] border border-line bg-white p-6 shadow-[0_4px_12px_rgba(15,110,110,0.05)]">
          <p className="text-sm leading-6 text-ink-muted">
            Daftar antrean hari berjalan akan tampil di sini pada fase integrasi
            modul antrean (QUE).
          </p>
        </div>
      </DashboardSection>
    </>
  );
};

export default PetugasDashboardPage;
