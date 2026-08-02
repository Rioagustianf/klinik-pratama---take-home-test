import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardList } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const STATUS_VARIANT = {
  Menunggu: "warning",
  CheckIn: "primary",
  Pemeriksaan: "secondary",
  Selesai: "success",
  Batal: "destructive",
};

const ALL_STATUSES = ["Menunggu", "CheckIn", "Pemeriksaan", "Selesai", "Batal"];

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  if (typeof dateStr === "string" && dateStr.includes("T")) {
    return dateStr.split("T")[0];
  }
  return dateStr;
};

const StatusSelect = ({ value, onChange, disabled }) => (
  <Select value={value} onValueChange={onChange} disabled={disabled}>
    <SelectTrigger className="h-9 w-36 text-xs">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {ALL_STATUSES.map((s) => (
        <SelectItem key={s} value={s}>
          {s}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

const LoadingSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <div
        key={i}
        className="flex items-center justify-between p-4 bg-white rounded-xl border border-line"
      >
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white rounded-xl border border-line space-y-3">
    <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-ink-muted">
      <ClipboardList className="w-6 h-6" />
    </div>
    <div className="space-y-1">
      <h3 className="text-base font-semibold text-ink">
        Belum ada kunjungan
      </h3>
      <p className="text-xs text-ink-soft">
        Daftarkan kunjungan baru atau ubah filter pencarian.
      </p>
    </div>
  </div>
);

export function RegistrationTable({
  registrations = [],
  isLoading,
  onUpdateStatus,
}) {
  if (isLoading) return <LoadingSkeleton />;
  if (registrations.length === 0) return <EmptyState />;

  return (
    <div className="space-y-4">
      <div className="hidden md:block overflow-hidden rounded-xl border border-line bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-line bg-surface text-ink-soft font-semibold text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4">No. Antrean</th>
                <th className="py-3.5 px-4">Pasien</th>
                <th className="py-3.5 px-4">Dokter / Poli</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Pembayaran</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-ink font-normal">
              {registrations.map((reg) => (
                <tr
                  key={reg.id}
                  className="hover:bg-surface/50 transition-colors"
                >
                  <td className="py-3.5 px-4 font-semibold text-brand-700">
                    {reg.queue?.nomor_antrean || "-"}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-sm font-medium">{reg.patient?.nama}</div>
                    <div className="text-xs text-ink-soft font-mono">
                      {reg.patient?.no_rm}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-sm">{reg.doctor?.nama}</div>
                    <div className="text-xs text-ink-soft">
                      {reg.doctor?.poli?.nama_poli}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-ink-soft">
                    {formatDate(reg.tanggal_kunjungan)}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="default" className="text-[10px]">
                      {reg.jenis_pembayaran}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={STATUS_VARIANT[reg.status] || "default"}
                      className="font-semibold"
                    >
                      {reg.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <StatusSelect
                      value={reg.status}
                      disabled={reg.status === "Batal" || reg.status === "Selesai"}
                      onChange={(newStatus) => onUpdateStatus(reg, newStatus)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:hidden">
        {registrations.map((reg) => (
          <div
            key={reg.id}
            className="p-4 bg-white rounded-xl border border-line space-y-3 shadow-xs"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-brand-700 block">
                  {reg.queue?.nomor_antrean || "-"}
                </span>
                <h4 className="text-sm font-semibold text-ink leading-tight mt-0.5">
                  {reg.patient?.nama}
                </h4>
                <p className="text-xs text-ink-soft mt-0.5">
                  {reg.doctor?.nama} — {reg.doctor?.poli?.nama_poli}
                </p>
              </div>
              <Badge
                variant={STATUS_VARIANT[reg.status] || "default"}
                className="font-semibold text-[10px] px-2"
              >
                {reg.status}
              </Badge>
            </div>

            <div className="text-xs space-y-1 text-ink-soft">
              <p>
                <span className="font-medium text-ink">Tanggal:</span>{" "}
                {formatDate(reg.tanggal_kunjungan)}
              </p>
              <p>
                <span className="font-medium text-ink">Pembayaran:</span>{" "}
                {reg.jenis_pembayaran}
              </p>
              {reg.keluhan_awal && (
                <p>
                  <span className="font-medium text-ink">Keluhan:</span>{" "}
                  {reg.keluhan_awal}
                </p>
              )}
            </div>

            {reg.status !== "Batal" && reg.status !== "Selesai" && (
              <div className="pt-2 border-t border-line flex justify-end">
                <StatusSelect
                  value={reg.status}
                  onChange={(newStatus) => onUpdateStatus(reg, newStatus)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}