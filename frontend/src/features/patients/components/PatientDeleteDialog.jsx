import {
  Dialog,
  DialogPopup,
  DialogPortal,
  DialogBackdrop,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function PatientDeleteDialog({
  isOpen,
  onClose,
  patient,
  onDelete,
  isLoading,
}) {
  if (!patient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="max-w-sm">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-error-container flex items-center justify-center text-on-error-container">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <DialogTitle>Hapus Data Pasien?</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus pasien{" "}
                <strong className="text-ink">{patient.nama}</strong>? Tindakan
                ini akan menonaktifkan data pasien dan tidak dapat dibatalkan,
                namun riwayat medis akan tetap tersimpan.
              </DialogDescription>
            </div>

            <div className="flex w-full gap-3 pt-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 h-10 text-white bg-brand-600 hover:bg-brand-700 hover:text-white rounded-md"
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={() => onDelete(patient.id)}
                className="flex-1 h-10 text-white bg-brand-600 hover:bg-brand-700 rounded-md"
                disabled={isLoading}
              >
                {isLoading ? "Menghapus..." : "Ya, Hapus"}
              </Button>
            </div>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
