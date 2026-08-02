import { Eye, Edit3, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateForInput } from "@/lib/utils";

export const PatientTable = ({
  patients = [],
  isLoading,
  onDetail,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
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
  }

  if (patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white rounded-xl border border-line space-y-3">
        <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-ink-muted">
          <User className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-ink">
            Tidak ada data pasien
          </h3>
          <p className="text-xs text-ink-soft">
            Belum ada pasien yang terdaftar atau pencarian Anda tidak ditemukan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="hidden md:block overflow-hidden rounded-xl border border-line bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-line bg-surface text-ink-soft font-semibold text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4">No. RM</th>
                <th className="py-3.5 px-4">NIK</th>
                <th className="py-3.5 px-4">Nama Pasien</th>
                <th className="py-3.5 px-4">L/P</th>
                <th className="py-3.5 px-4">Tgl Lahir</th>
                <th className="py-3.5 px-4">No. Telp</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-ink font-normal">
              {patients.map((patient) => (
                <tr
                  key={patient.id}
                  className="hover:bg-surface/50 transition-colors"
                >
                  <td className="py-3.5 px-4 font-semibold text-brand-700">
                    {patient.no_rm}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-ink-soft">
                    {patient.nik}
                  </td>
                  <td className="py-3.5 px-4 font-medium">{patient.nama}</td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        patient.jenis_kelamin === "L" ? "default" : "secondary"
                      }
                      className="font-semibold"
                    >
                      {patient.jenis_kelamin === "L"
                        ? "Laki-laki"
                        : "Perempuan"}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-ink-soft text-xs">
                    {formatDateForInput(patient.tanggal_lahir)}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-mono">
                    {patient.no_telp || "-"}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDetail(patient)}
                        title="Detail Pasien"
                        className="h-8 w-8 text-ink-muted hover:text-brand-600 hover:bg-brand-50"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(patient)}
                        title="Edit Pasien"
                        className="h-8 w-8 text-ink-muted hover:text-brand-600 hover:bg-brand-50"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(patient)}
                        title="Hapus Pasien"
                        className="h-8 w-8 text-danger-500 hover:text-danger-700 hover:bg-danger-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:hidden">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="p-4 bg-white rounded-xl border border-line space-y-3 shadow-xs"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-brand-700 block">
                  {patient.no_rm}
                </span>
                <h4 className="text-sm font-semibold text-ink leading-tight mt-0.5">
                  {patient.nama}
                </h4>
              </div>
              <Badge
                variant={
                  patient.jenis_kelamin === "L" ? "default" : "secondary"
                }
                className="font-semibold text-[10px] px-2"
              >
                {patient.jenis_kelamin === "L" ? "Laki-Laki" : "Perempuan"}
              </Badge>
            </div>

            <div className="text-xs space-y-1 text-ink-soft">
              <p>
                <span className="font-medium text-ink">NIK:</span>{" "}
                <span className="font-mono">{patient.nik}</span>
              </p>
              <p>
                <span className="font-medium text-ink">Tgl Lahir:</span>{" "}
                {formatDateForInput(patient.tanggal_lahir)}
              </p>
              <p>
                <span className="font-medium text-ink">No. Telp:</span>{" "}
                {patient.no_telp || "-"}
              </p>
            </div>

            <div className="pt-2 border-t border-line flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDetail(patient)}
                className="h-8 text-xs"
              >
                <Eye className="w-3.5 h-3.5 mr-1" />
                Detail
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(patient)}
                className="h-8 text-xs"
              >
                <Edit3 className="w-3.5 h-3.5 mr-1" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(patient)}
                className="h-8 text-xs text-danger-500 hover:text-danger-700 hover:bg-danger-100"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Hapus
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
