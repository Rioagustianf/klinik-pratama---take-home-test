import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { formatDateForInput } from "@/lib/utils";

const registrationSchema = z.object({
  patient_id: z.coerce.number().min(1, "Pasien wajib dipilih"),
  doctor_id: z.coerce.number().min(1, "Dokter wajib dipilih"),
  tanggal_kunjungan: z.string().min(1, "Tanggal kunjungan wajib diisi"),
  jenis_pembayaran: z.enum(["Umum", "BPJS", "Asuransi"], {
    error: "Jenis pembayaran wajib dipilih",
  }),
  keluhan_awal: z.string().optional(),
});

export function RegistrationForm({ patients, doctors, onSave, isLoading }) {
  const form = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      patient_id: "",
      doctor_id: "",
      tanggal_kunjungan: new Date().toISOString().split("T")[0],
      jenis_pembayaran: "Umum",
      keluhan_awal: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await onSave(data);
      form.reset();
    } catch {
      /* kesalahan diserahkan ke halaman */
    }
  };

  return (
    <div className="rounded-[16px] border border-line bg-white p-6 shadow-[0_4px_12px_rgba(15,110,110,0.05)]">
      <h2 className="mb-4 text-lg font-bold tracking-tight text-ink">
        Form Pendaftaran Kunjungan
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <FormField
              control={form.control}
              name="patient_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pasien</FormLabel>
                  <FormControl>
                    <Combobox
                      options={patients.map((p) => ({
                        value: String(p.id),
                        label: `${p.nama} — ${p.no_rm}`,
                      }))}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Cari nama / No. RM pasien..."
                      emptyText="Pasien tidak ditemukan"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="doctor_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dokter</FormLabel>
                  <FormControl>
                    <Combobox
                      options={doctors.map((d) => ({
                        value: String(d.id),
                        label: `${d.nama} — ${d.poli?.nama_poli || "Poli"}`,
                      }))}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Cari dokter..."
                      emptyText="Dokter tidak ditemukan"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tanggal_kunjungan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Kunjungan</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      value={formatDateForInput(field.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jenis_pembayaran"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Pembayaran</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih pembayaran" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Umum">Umum</SelectItem>
                        <SelectItem value="BPJS">BPJS</SelectItem>
                        <SelectItem value="Asuransi">Asuransi</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="keluhan_awal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keluhan Awal</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    rows={3}
                    placeholder="Deskripsi keluhan pasien..."
                    className="w-full rounded-[10px] border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-600"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="h-10 bg-brand-600 text-white rounded-md hover:bg-brand-700 hover:text-white"
            >
              {isLoading ? "Mendaftarkan..." : "Daftarkan Kunjungan"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
