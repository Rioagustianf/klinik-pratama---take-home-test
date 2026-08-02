import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, History, FileText, Pill, Activity } from "lucide-react";
import { usePatientHistoryQuery } from "../hooks/useMedicalRecords";

const LoadingSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <div
        key={i}
        className="p-4 bg-white rounded-xl border border-line space-y-2"
      >
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-line space-y-3">
    <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-ink-muted">
      <History className="w-6 h-6" />
    </div>
    <div className="space-y-1">
      <h3 className="text-base font-semibold text-ink">Belum ada riwayat</h3>
      <p className="text-xs text-ink-soft">
        Pasien ini belum pernah diperiksa.
      </p>
    </div>
  </div>
);

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  if (typeof dateStr === "string" && dateStr.includes("T")) {
    return dateStr.split("T")[0];
  }
  return dateStr;
};

/**
 * Riwayat pemeriksaan pasien (EXM-05).
 * Fetch sendiri via usePatientHistoryQuery — bisa dipakai di halaman dokter
 * atau di modal detail pasien tanpa setup manual.
 */
export function PatientHistory({ patientId, onClose }) {
  const { data, isLoading } = usePatientHistoryQuery(patientId);

  const records = data?.data ?? [];

  return (
    <div className="space-y-4">
      {onClose && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 px-2 text-xs"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <h2 className="text-lg font-bold tracking-tight text-ink">
            Riwayat Pemeriksaan
          </h2>
        </div>
      )}

      {isLoading ? (
        <LoadingSkeleton />
      ) : records.length === 0 ? (
        <EmptyState />
      ) : (
        records.map((record) => (
          <div
            key={record.id}
            className="rounded-[16px] border border-line bg-white p-4 shadow-[0_4px_12px_rgba(15,110,110,0.05)]"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-brand-600/10 text-brand-700">
                  <FileText className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {record.doctor?.nama || "-"}
                  </p>
                  <p className="text-xs text-ink-soft">
                    {formatDate(record.tanggal_kunjungan)} •{" "}
                    {record.poli?.nama_poli}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-3 space-y-2 text-sm">
              {record.subjective && (
                <p>
                  <span className="font-semibold text-ink">S:</span>{" "}
                  <span className="text-ink-soft">{record.subjective}</span>
                </p>
              )}
              {(record.tekanan_darah ||
                record.suhu ||
                record.berat_badan ||
                record.tinggi_badan) && (
                <p className="text-ink-soft">
                  <span className="font-semibold text-ink">O:</span> TD{" "}
                  {record.tekanan_darah || "-"} mmHg, Suhu {record.suhu ?? "-"}°C,
                  BB {record.berat_badan ?? "-"} kg, TB{" "}
                  {record.tinggi_badan ?? "-"} cm
                </p>
              )}
              {record.diagnosa && (
                <p>
                  <span className="font-semibold text-ink">A:</span>{" "}
                  <span className="text-ink-soft">{record.diagnosa}</span>
                </p>
              )}
              {record.rencana_terapi && (
                <p>
                  <span className="font-semibold text-ink">P:</span>{" "}
                  <span className="text-ink-soft">{record.rencana_terapi}</span>
                </p>
              )}
            </div>

            {record.actions?.length > 0 && (
              <div className="mb-3">
                <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  <Activity className="size-3.5" /> Tindakan
                </p>
                <div className="flex flex-wrap gap-2">
                  {record.actions.map((a) => (
                    <span
                      key={a.id}
                      className="rounded-[8px] border border-line bg-surface px-2 py-1 text-xs text-ink-soft"
                    >
                      {a.nama_tindakan}
                      {a.catatan ? ` — ${a.catatan}` : ""}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {record.prescriptions?.length > 0 && (
              <div>
                <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  <Pill className="size-3.5" /> Resep Obat
                </p>
                <div className="flex flex-wrap gap-2">
                  {record.prescriptions.map((p) => (
                    <span
                      key={p.id}
                      className="rounded-[8px] border border-line bg-surface px-2 py-1 text-xs text-ink-soft"
                    >
                      {p.nama_obat} — {p.dosis} ({p.aturan_pakai})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}