import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PhoneCall, ListOrdered } from "lucide-react";

function speakQueueNumber(nomorAntrean) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  const digits = nomorAntrean
    .replace(/^([A-Za-z]+)(\d+)$/, "$1 $2")
    .split("")
    .join(" ");

  const utterance = new SpeechSynthesisUtterance(
    `Nomor antrean ${digits}, silakan menuju ke loket.`,
  );
  utterance.lang = "id-ID";
  utterance.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

const STATUS_VARIANT = {
  Menunggu: "warning",
  CheckIn: "primary",
  Pemeriksaan: "secondary",
  Selesai: "success",
  Batal: "destructive",
};

const STATUS_LABEL = {
  Menunggu: "Menunggu",
  CheckIn: "CheckIn",
  Pemeriksaan: "Pemeriksaan",
  Selesai: "Selesai",
  Batal: "Batal",
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
      <ListOrdered className="w-6 h-6" />
    </div>
    <div className="space-y-1">
      <h3 className="text-base font-semibold text-ink">
        Belum ada antrean hari ini
      </h3>
      <p className="text-xs text-ink-soft">
        Daftarkan kunjungan baru di halaman Pendaftaran.
      </p>
    </div>
  </div>
);

export function QueueBoard({
  queues = [],
  isLoading,
  onCall,
  onUpdateStatus,
  callLoadingId,
  statusLoadingId,
}) {
  if (isLoading) return <LoadingSkeleton />;
  if (queues.length === 0) return <EmptyState />;

  return (
    <div className="space-y-3">
      {queues.map((queue) => {
        const isCalling = callLoadingId === queue.id;
        const isStatusLoading = statusLoadingId === queue.id;
        const isActive =
          queue.status === "Menunggu" || queue.status === "CheckIn";

        return (
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

            <div className="flex items-center justify-between gap-3 md:justify-end">
              <Badge
                variant={STATUS_VARIANT[queue.status] || "default"}
                className="font-semibold"
              >
                {STATUS_LABEL[queue.status] || queue.status}
              </Badge>

              {queue.status === "Menunggu" && (
                <Button
                  onClick={() => {
                    speakQueueNumber(queue.nomor_antrean);
                    onCall(queue);
                  }}
                  disabled={isCalling}
                  className="h-9 rounded-md bg-brand-600 text-white hover:bg-brand-700"
                >
                  <PhoneCall className="mr-2 size-4" />
                  {isCalling ? "Memanggil..." : "Call"}
                </Button>
              )}

              {isActive && (
                <select
                  value={queue.status}
                  disabled={isStatusLoading}
                  onChange={(e) => onUpdateStatus(queue, e.target.value)}
                  className="h-9 rounded-[8px] border border-line bg-white px-2 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-brand-600"
                >
                  <option value="Menunggu">Menunggu</option>
                  <option value="CheckIn">CheckIn</option>
                  <option value="Pemeriksaan">Pemeriksaan</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Batal">Batal</option>
                </select>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
