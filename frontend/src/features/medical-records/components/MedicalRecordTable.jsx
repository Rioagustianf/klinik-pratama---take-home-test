import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Stethoscope, ClipboardList, History } from "lucide-react";

const STATUS_VARIANT = {
  CheckIn: "primary",
  Pemeriksaan: "secondary",
};

const LoadingSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="flex items-center justify-between p-4 bg-white rounded-xl border border-line"
      >
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white rounded-xl border border-line space-y-3">
    <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-ink-muted">
      <Stethoscope className="w-6 h-6" />
    </div>
    <div className="space-y-1">
      <h3 className="text-base font-semibold text-ink">
        Tidak ada pasien untuk diperiksa
      </h3>
      <p className="text-xs text-ink-soft">
        Pasien berstatus CheckIn / Pemeriksaan akan muncul di sini.
      </p>
    </div>
  </div>
);

export function MedicalRecordTable({
  queues = [],
  isLoading,
  onExamine,
  examiningId,
  onHistory,
}) {
  if (isLoading) return <LoadingSkeleton />;
  if (queues.length === 0) return <EmptyState />;

  return (
    <div className="space-y-3">
      {queues.map((queue) => (
        <div
          key={queue.id}
          className="flex flex-col gap-4 rounded-[16px] border border-line bg-white p-4 md:flex-row md:items-center md:justify-between shadow-[0_4px_12px_rgba(15,110,110,0.05)]"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-600/10 text-brand-700">
              <span className="text-lg font-bold tracking-tight">
                {queue.nomor_antrean}
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">
                {queue.registration?.patient?.nama || "-"}
              </p>
              <p className="truncate text-xs text-ink-soft">
                {queue.registration?.doctor?.nama || "-"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 md:justify-end">
            <Badge
              variant={STATUS_VARIANT[queue.status] || "default"}
              className="font-semibold"
            >
              {queue.status}
            </Badge>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onHistory(queue.registration?.patient?.id)}
              className="h-8 text-xs"
            >
              <History className="mr-1 size-3.5" />
              Riwayat
            </Button>

            <Button
              onClick={() => onExamine(queue)}
              disabled={examiningId === queue.id}
              className="h-9 rounded-md bg-brand-600 text-white hover:bg-brand-700"
            >
              <ClipboardList className="mr-2 size-4" />
              {examiningId === queue.id ? "Memuat..." : "Periksa"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}