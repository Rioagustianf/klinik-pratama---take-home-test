import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";

const soapSchema = z.object({
  subjective: z.string().optional(),
  tekanan_darah: z.string().optional(),
  suhu: z.coerce.number().min(0, "Suhu harus angka positif").optional(),
  berat_badan: z.coerce
    .number()
    .min(0, "Berat badan harus angka positif")
    .optional(),
  tinggi_badan: z.coerce
    .number()
    .min(0, "Tinggi badan harus angka positif")
    .optional(),
  diagnosa: z.string().optional(),
  rencana_terapi: z.string().optional(),
  tindakan: z
    .array(
      z.object({
        nama_tindakan: z.string().min(1, "Nama tindakan wajib diisi"),
        catatan: z.string().optional(),
      }),
    )
    .optional(),
  resep: z
    .array(
      z.object({
        nama_obat: z.string().min(1, "Nama obat wajib diisi"),
        dosis: z.string().min(1, "Dosis wajib diisi"),
        aturan_pakai: z.string().min(1, "Aturan pakai wajib diisi"),
      }),
    )
    .optional(),
});

const emptyTindakan = { nama_tindakan: "", catatan: "" };
const emptyResep = { nama_obat: "", dosis: "", aturan_pakai: "" };

export function SoapForm({ registration, onSave, isLoading }) {
  const [tab, setTab] = useState("S");

  const form = useForm({
    resolver: zodResolver(soapSchema),
    defaultValues: {
      subjective: "",
      tekanan_darah: "",
      suhu: undefined,
      berat_badan: undefined,
      tinggi_badan: undefined,
      diagnosa: "",
      rencana_terapi: "",
      tindakan: [emptyTindakan],
      resep: [emptyResep],
    },
  });

  const tindakanFields = useFieldArray({
    control: form.control,
    name: "tindakan",
  });
  const resepFields = useFieldArray({ control: form.control, name: "resep" });

  const onSubmit = async (data) => {
    const payload = {
      registration_id: registration.id,
      ...data,
      tindakan: (data.tindakan ?? []).filter((t) => t.nama_tindakan),
      resep: (data.resep ?? []).filter((r) => r.nama_obat),
    };
    try {
      await onSave(payload);
    } catch {
      /* kesalahan diserahkan ke halaman */
    }
  };

  return (
    <div className="rounded-[16px] border border-line bg-white p-6 shadow-[0_4px_12px_rgba(15,110,110,0.05)]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-ink">
            Form Pemeriksaan (SOAP)
          </h2>
          <p className="mt-1 text-xs text-ink-soft">
            {registration?.patient?.nama} — {registration?.patient?.no_rm} •{" "}
            {registration?.doctor?.nama}
          </p>
        </div>
        <span className="rounded-[8px] bg-brand-600/10 px-3 py-1 text-xs font-semibold text-brand-700">
          {registration?.queue?.nomor_antrean || "-"}
        </span>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="S">S — Subjective</TabsTrigger>
              <TabsTrigger value="O">O — Objective</TabsTrigger>
              <TabsTrigger value="A">A — Assessment</TabsTrigger>
              <TabsTrigger value="P">P — Plan</TabsTrigger>
            </TabsList>

            <TabsContent value="S">
              <FormField
                control={form.control}
                name="subjective"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keluhan Pasien</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        rows={4}
                        placeholder="Deskripsikan keluhan yang dirasakan pasien..."
                        className="w-full rounded-[10px] border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="O">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="tekanan_darah"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tekanan Darah (mmHg)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="120/80" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="suhu"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suhu Tubuh (°C)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.1"
                          placeholder="37.0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="berat_badan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Berat Badan (kg)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.1"
                          placeholder="65"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tinggi_badan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tinggi Badan (cm)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.1"
                          placeholder="170"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent value="A">
              <FormField
                control={form.control}
                name="diagnosa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diagnosa</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Hasil diagnosis dokter..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="P">
              <FormField
                control={form.control}
                name="rencana_terapi"
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>Rencana Terapi</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        rows={2}
                        placeholder="Rencana terapi / instruksi lanjutan..."
                        className="w-full rounded-[10px] border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-ink">
                    Tindakan Medis
                  </h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => tindakanFields.append(emptyTindakan)}
                    className="h-8 rounded-md bg-brand-600 text-white hover:bg-brand-700 hover:text-white text-xs"
                  >
                    <Plus className="mr-1 size-3.5" />
                    Tambah
                  </Button>
                </div>
                <div className="space-y-3">
                  {tindakanFields.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex flex-col gap-2 rounded-[10px] border border-line bg-surface/50 p-3 sm:flex-row sm:items-end"
                    >
                      <FormField
                        control={form.control}
                        name={`tindakan.${index}.nama_tindakan`}
                        render={({ field: f }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Nama Tindakan</FormLabel>
                            <FormControl>
                              <Input {...f} placeholder="Nama tindakan..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`tindakan.${index}.catatan`}
                        render={({ field: f }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Catatan</FormLabel>
                            <FormControl>
                              <Input {...f} placeholder="Catatan..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => tindakanFields.remove(index)}
                        className="size-9 shrink-0 text-danger-500 hover:bg-danger-100 hover:text-danger-700"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-ink">Resep Obat</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => resepFields.append(emptyResep)}
                    className="h-8 rounded-md bg-brand-600 text-white hover:bg-brand-700 hover:text-white text-xs"
                  >
                    <Plus className="mr-1 size-3.5" />
                    Tambah Obat
                  </Button>
                </div>
                <div className="space-y-3">
                  {resepFields.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex flex-col gap-2 rounded-[10px] border border-line bg-surface/50 p-3 sm:flex-row sm:items-end"
                    >
                      <FormField
                        control={form.control}
                        name={`resep.${index}.nama_obat`}
                        render={({ field: f }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Nama Obat</FormLabel>
                            <FormControl>
                              <Input {...f} placeholder="Nama obat..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`resep.${index}.dosis`}
                        render={({ field: f }) => (
                          <FormItem className="w-24">
                            <FormLabel>Dosis</FormLabel>
                            <FormControl>
                              <Input {...f} placeholder="3x1" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`resep.${index}.aturan_pakai`}
                        render={({ field: f }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Aturan Pakai</FormLabel>
                            <FormControl>
                              <Input {...f} placeholder="Sesudah makan" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => resepFields.remove(index)}
                        className="size-9 shrink-0 text-danger-500 hover:bg-danger-100 hover:text-danger-700"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-end gap-3 border-t border-line pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="h-10 rounded-md bg-brand-600 text-white hover:bg-brand-700"
            >
              {isLoading ? "Menyimpan..." : "Simpan Rekam Medis"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
