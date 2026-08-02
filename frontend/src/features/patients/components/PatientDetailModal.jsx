import {
  Dialog,
  DialogPopup,
  DialogPortal,
  DialogBackdrop,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Calendar,
  Smartphone,
  MapPin,
  Fingerprint,
  History,
  Pill,
  Activity,
} from "lucide-react";
import { formatDateForInput } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { usePatientHistoryQuery } from "@/features/medical-records/hooks/useMedicalRecords";

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex gap-3 items-start">
    <div className="mt-0.5 p-1.5 rounded-lg bg-surface text-ink-muted shrink-0">
      <Icon className="w-4 h-4" />
    </div>
    <div className="space-y-0.5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
        {label}
      </p>
      <p className="text-sm font-medium text-ink leading-relaxed">
        {value || "-"}
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

const HistorySkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 2 }).map((_, i) => (
      <div key={i} className="space-y-2 rounded-[10px] border border-line p-3">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    ))}
  </div>
);

const HistoryEmpty = () => (
  <p className="text-xs text-ink-soft leading-relaxed bg-surface p-3 rounded-lg border border-line border-dashed">
    Belum ada riwayat pemeriksaan untuk pasien ini.
  </p>
);

const PatientHistorySection = ({ patientId }) => {
  const { user } = useAuth();
  const canReadMedical =
    user?.role === "Admin" || user?.role === "Dokter";

  const { data, isLoading } = usePatientHistoryQuery(
    canReadMedical ? patientId : null,
  );

  if (!canReadMedical) {
    return (
      <p className="text-xs text-ink-soft leading-relaxed bg-surface p-3 rounded-lg border border-line border-dashed">
        Riwayat medis hanya dapat diakses oleh Admin dan Dokter.
      </p>
    );
  }

  if (isLoading) return <HistorySkeleton />;

  const records = data?.data ?? [];
  if (records.length === 0) return <HistoryEmpty />;

  return (
    <div className="space-y-3">
      {records.map((record) => (
        <div
          key={record.id}
          className="rounded-[10px] border border-line bg-surface/50 p-3"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-ink">
              {formatDate(record.tanggal_kunjungan)}
            </p>
            <span className="text-[10px] text-ink-soft">
              {record.doctor?.nama}
            </span>
          </div>

          <div className="space-y-1 text-xs text-ink-soft">
            {record.subjective && (
              <p>
                <span className="font-semibold text-ink">S:</span>{" "}
                {record.subjective}
              </p>
            )}
            {(record.tekanan_darah ||
              record.suhu ||
              record.berat_badan ||
              record.tinggi_badan) && (
                <p>
                  <span className="font-semibold text-ink">O:</span> TD{" "}
                  {record.tekanan_darah || "-"} mmHg, Suhu {record.suhu ?? "-"}°C,
                  BB {record.berat_badan ?? "-"} kg, TB {record.tinggi_badan ?? "-"}{" "}
                  cm
                </p>
              )}
            {record.diagnosa && (
              <p>
                <span className="font-semibold text-ink">A:</span>{" "}
                {record.diagnosa}
              </p>
            )}
            {record.rencana_terapi && (
              <p>
                <span className="font-semibold text-ink">P:</span>{" "}
                {record.rencana_terapi}
              </p>
            )}
          </div>

          {record.actions?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {record.actions.map((a) => (
                <span
                  key={a.id}
                  className="inline-flex items-center gap-1 rounded-[6px] border border-line bg-white px-1.5 py-0.5 text-[10px] text-ink-soft"
                >
                  <Activity className="size-3" />
                  {a.nama_tindakan}
                </span>
              ))}
            </div>
          )}

          {record.prescriptions?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {record.prescriptions.map((p) => (
                <span
                  key={p.id}
                  className="inline-flex items-center gap-1 rounded-[6px] border border-line bg-white px-1.5 py-0.5 text-[10px] text-ink-soft"
                >
                  <Pill className="size-3" />
                  {p.nama_obat} — {p.dosis}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export function PatientDetailModal({ isOpen, onClose, patient }) {
  if (!patient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="max-w-lg max-h-[90vh] overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-600/10 flex items-center justify-center text-brand-700 shrink-0">
                <User className="w-7 h-7 border rounded-full" />
              </div>
              <div className="min-w-0">
                <p className="text-xl truncate text-black">{patient.nama}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {patient.no_rm}
                  </Badge>
                  <Badge
                    variant={
                      patient.jenis_kelamin === "L" ? "default" : "secondary"
                    }
                  >
                    {patient.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 py-2">
              <DetailItem
                icon={Fingerprint}
                label="NIK (Nomor Induk Kependudukan)"
                value={patient.nik}
              />
              <DetailItem
                icon={Calendar}
                label="Tanggal Lahir"
                value={formatDateForInput(patient.tanggal_lahir)}
              />
              <DetailItem
                icon={Smartphone}
                label="Nomor Telepon"
                value={patient.no_telp}
              />
              <DetailItem
                icon={MapPin}
                label="Alamat Lengkap"
                value={patient.alamat}
              />
            </div>

            <div className="pt-4 border-t border-line space-y-4">
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-ink">
                  <History className="w-4 h-4 text-brand-600" />
                  Riwayat Kunjungan
                </h4>
                <div className="mt-3">
                  <PatientHistorySection patientId={patient.id} />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={onClose}
                  className="h-10 w-full bg-brand-600 hover:bg-brand-700 rounded-md sm:w-auto"
                >
                  Tutup
                </Button>
              </div>
            </div>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}