import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogPortal,
  DialogBackdrop,
  DialogPopup,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatDateForInput, getTodayLocal } from "@/lib/utils";

const patientSchema = z.object({
  nik: z
    .string()
    .length(16, "NIK harus tepat 16 digit")
    .regex(/^\d+$/, "NIK hanya boleh berisi angka"),
  nama: z.string().min(1, "Nama pasien harus diisi"),
  jenis_kelamin: z.enum(["L", "P"], { error: "Jenis kelamin harus dipilih" }),
  tanggal_lahir: z.string().min(1, "Tanggal lahir harus diisi"),
  no_telp: z.string().optional(),
  alamat: z.string().optional(),
});

export function PatientFormModal({
  isOpen,
  onClose,
  patient,
  onSave,
  isLoading,
}) {
  const isEdit = !!patient;

  const form = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      nik: "",
      nama: "",
      jenis_kelamin: "L",
      tanggal_lahir: "",
      no_telp: "",
      alamat: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(
        patient
          ? {
              nik: patient.nik,
              nama: patient.nama,
              jenis_kelamin: patient.jenis_kelamin,
              tanggal_lahir: formatDateForInput(patient.tanggal_lahir),
              no_telp: patient.no_telp ?? "",
              alamat: patient.alamat ?? "",
            }
          : {
              nik: "",
              nama: "",
              jenis_kelamin: "L",
              tanggal_lahir: "",
              no_telp: "",
              alamat: "",
            },
      );
    }
  }, [isOpen, patient, form]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        delete data.nik;
      }
      data.tanggal_lahir = formatDateForInput(data.tanggal_lahir);
      await onSave(data);
    } catch {
      /* kesalahan diserahkan ke halaman */
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="max-w-2xl">
          <div className="space-y-6">
            <div>
              <DialogTitle>
                {isEdit ? "Edit Data Pasien" : "Tambah Pasien Baru"}
              </DialogTitle>
              <DialogDescription>
                {isEdit
                  ? "Perbarui informasi pasien. NIK dan No. RM bersifat read-only."
                  : "Isi formulir untuk mendaftarkan pasien baru. No. RM digenerate otomatis."}
              </DialogDescription>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="nik"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          NIK{" "}
                          {isEdit && <span className="text-danger-500">*</span>}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            maxLength={16}
                            inputMode="numeric"
                            disabled={isEdit}
                            placeholder="16 digit NIK"
                            className="font-mono disabled:cursor-not-allowed disabled:bg-surface disabled:text-ink-muted"
                          />
                        </FormControl>
                        {isEdit ? (
                          <FormDescription>
                            NIK tidak dapat diubah (read-only).
                          </FormDescription>
                        ) : (
                          <FormMessage />
                        )}
                      </FormItem>
                    )}
                  />

                  {isEdit && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none text-ink-soft">
                        No. Rekam Medis
                      </label>
                      <div className="flex h-11 items-center rounded-[10px] border border-line bg-surface px-3 font-mono text-sm text-ink-soft">
                        {patient?.no_rm ?? "-"}
                      </div>
                      <p className="text-[0.8rem] text-ink-muted mt-1">
                        Digenerate otomatis oleh sistem.
                      </p>
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="nama"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nama lengkap pasien" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jenis_kelamin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jenis Kelamin</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih jenis kelamin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="L">Laki-laki (L)</SelectItem>
                              <SelectItem value="P">Perempuan (P)</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tanggal_lahir"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanggal Lahir</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="date"
                            value={formatDateForInput(field.value)}
                            max={getTodayLocal()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="no_telp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>No. Telepon</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="0812xxxxx"
                            inputMode="tel"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="alamat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Alamat lengkap pasien" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isLoading}
                    className="bg-brand-600 text-white rounded-md hover:bg-brand-700 hover:text-white"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-brand-600 text-white rounded-md hover:bg-brand-700 hover:text-white"
                  >
                    {isLoading
                      ? isEdit
                        ? "Menyimpan..."
                        : "Menambahkan..."
                      : isEdit
                        ? "Simpan Perubahan"
                        : "Tambah Pasien"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
