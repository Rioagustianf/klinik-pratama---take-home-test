import {
  Dialog,
  DialogPopup,
  DialogPortal,
  DialogBackdrop,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Calendar,
  Smartphone,
  MapPin,
  Fingerprint,
  History,
} from "lucide-react";
import { formatDateForInput } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { PatientHistory } from "@/features/medical-records/components/PatientHistory";

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

export function PatientDetailModal({ isOpen, onClose, patient }) {
  const { user } = useAuth();
  if (!patient) return null;

  // EXM-R: Petugas dilarang melihat detail medis (PRD matriks otorisasi)
  const canReadMedical = user?.role === "Admin" || user?.role === "Dokter";

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
              <h4 className="flex items-center gap-2 text-sm font-bold text-ink">
                <History className="w-4 h-4 text-brand-600" />
                Riwayat Kunjungan
              </h4>

              {canReadMedical ? (
                <PatientHistory patientId={patient.id} />
              ) : (
                <p className="text-xs text-ink-soft leading-relaxed bg-surface p-3 rounded-lg border border-line border-dashed">
                  Riwayat medis hanya dapat diakses oleh Admin dan Dokter.
                </p>
              )}

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