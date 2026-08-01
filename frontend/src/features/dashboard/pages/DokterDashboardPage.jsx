import { Clock, Stethoscope, CheckCircle2 } from "lucide-react";
import StatCard from "../components/StatCard";
import DashboardSection from "../components/DashboardSection";

const metrics = [
  {
    id: "menunggu",
    label: "Antrean Menunggu",
    value: 8,
    description: "Pasien menunggu pemeriksaan Anda",
    icon: Clock,
    tone: "warning",
  },
  {
    id: "diperiksa",
    label: "Sedang Diperiksa",
    value: 1,
    description: "Pasien yang sedang Anda periksa",
    icon: Stethoscope,
    tone: "primary",
  },
  {
    id: "selesai",
    label: "Pemeriksaan Selesai",
    value: 12,
    description: "Rekam medis selesai hari ini",
    icon: CheckCircle2,
    tone: "success",
  },
];

const DokterDashboardPage = () => {
  return (
    <>
      <DashboardSection
        title="Ringkasan Pemeriksaan"
        description="Antrean pemeriksaan aktif dan status hari ini"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {metrics.map((metric) => (
            <StatCard key={metric.id} {...metric} />
          ))}
        </div>
      </DashboardSection>

      <DashboardSection
        title="Antrean Pemeriksaan"
        description="Pasien yang perlu Anda periksa"
      >
        <div className="rounded-[16px] border border-line bg-white p-6 shadow-[0_4px_12px_rgba(15,110,110,0.05)]">
          <p className="text-sm leading-6 text-ink-muted">
            Daftar antrean pemeriksaan akan tampil di sini pada fase integrasi
            modul antrean (QUE) dan pemeriksaan (EXM/SOAP).
          </p>
        </div>
      </DashboardSection>
    </>
  );
};

export default DokterDashboardPage;
