import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Clock, Stethoscope, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { BarChartComponent } from "@/components/ui/chart";
import StatCard from "../components/StatCard";
import DashboardSection from "../components/DashboardSection";
import { queuesApi } from "@/features/queues/api/queuesApi";

const STATUS_VARIANT = {
  Menunggu: "warning",
  CheckIn: "primary",
  Pemeriksaan: "secondary",
  Selesai: "success",
  Batal: "destructive",
};

const DokterDashboardPage = () => {
  const navigate = useNavigate();
  const { data: queuesData, isLoading } = useQuery({
    queryKey: ["queues"],
    queryFn: () => queuesApi.getQueues(),
    refetchInterval: 10_000,
    refetchIntervalInBackground: false,
  });

  const queues = queuesData?.data ?? [];
  const menunggu = queues.filter((q) => q.status === "Menunggu").length;
  const diperiksa = queues.filter(
    (q) => q.status === "CheckIn" || q.status === "Pemeriksaan",
  ).length;
  const selesai = queues.filter((q) => q.status === "Selesai").length;

  // Antrean yang SIAP diperiksa (CheckIn/Pemeriksaan, keduanya sync)
  const readyQueues = queues.filter(
    (q) =>
      (q.status === "CheckIn" || q.status === "Pemeriksaan") &&
      (q.registration?.status === "CheckIn" ||
        q.registration?.status === "Pemeriksaan"),
  );

  // Data untuk grafik distribusi
  const chartData = [
    { status: "Menunggu", count: menunggu },
    { status: "CheckIn", count: queues.filter((q) => q.status === "CheckIn").length },
    { status: "Pemeriksaan", count: queues.filter((q) => q.status === "Pemeriksaan").length },
    { status: "Selesai", count: selesai },
    { status: "Batal", count: queues.filter((q) => q.status === "Batal").length },
  ].filter((d) => d.count > 0);

  const metrics = [
    {
      id: "menunggu",
      label: "Antrean Menunggu",
      value: menunggu,
      description: "Pasien menunggu pemeriksaan Anda",
      icon: Clock,
      tone: "warning",
    },
    {
      id: "diperiksa",
      label: "Sedang Diperiksa",
      value: diperiksa,
      description: "Pasien yang sedang/perlu Anda periksa",
      icon: Stethoscope,
      tone: "primary",
    },
    {
      id: "selesai",
      label: "Pemeriksaan Selesai",
      value: selesai,
      description: "Rekam medis selesai hari ini",
      icon: CheckCircle2,
      tone: "success",
    },
  ];

  return (
    <>
      <DashboardSection
        title="Ringkasan Pemeriksaan"
        description="Antrean pemeriksaan aktif dan status hari ini"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {metrics.map((metric) => (
            <StatCard key={metric.id} {...metric} isLoading={isLoading} />
          ))}
        </div>
      </DashboardSection>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Grafik distribusi antrean */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribusi Antrean</CardTitle>
            <CardDescription>
              Jumlah antrean berdasarkan status hari ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : chartData.length === 0 ? (
              <p className="py-10 text-center text-sm text-ink-muted">
                Belum ada antrean hari ini.
              </p>
            ) : (
              <BarChartComponent data={chartData} height={250} />
            )}
          </CardContent>
        </Card>

        {/* Antrean yang perlu diperiksa */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pasien Siap Diperiksa</CardTitle>
            <CardDescription>
              Klik "Periksa" untuk membuka form SOAP
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : readyQueues.length === 0 ? (
              <p className="py-10 text-center text-sm text-ink-muted">
                Tidak ada pasien yang siap diperiksa.
              </p>
            ) : (
              <div className="space-y-3">
                {readyQueues.slice(0, 5).map((queue) => (
                  <div
                    key={queue.id}
                    className="flex items-center justify-between gap-3 rounded-[12px] border border-line bg-surface/40 p-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-sm font-bold text-brand-700">
                        {queue.nomor_antrean}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">
                          {queue.registration?.patient?.nama}
                        </p>
                        <p className="truncate text-xs text-ink-soft">
                          {queue.registration?.doctor?.nama}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={STATUS_VARIANT[queue.status] || "default"}
                      className="shrink-0 text-[10px]"
                    >
                      {queue.status}
                    </Badge>
                  </div>
                ))}
                {readyQueues.length > 5 && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => navigate("/medical-records")}
                    className="h-8 px-0 text-xs"
                  >
                    Lihat semua ({readyQueues.length}) <ArrowRight className="ml-1 size-3" />
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabel riwayat antrean hari ini */}
      <DashboardSection
        title="Antrean Hari Ini"
        description="Status seluruh antrean hari berjalan"
      >
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-3 p-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : queues.length === 0 ? (
              <p className="py-8 text-center text-sm text-ink-muted">
                Belum ada antrean hari ini.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Antrean</TableHead>
                    <TableHead>Pasien</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {queues.map((queue) => (
                    <TableRow key={queue.id}>
                      <TableCell className="font-semibold text-brand-700">
                        {queue.nomor_antrean}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium text-ink">
                          {queue.registration?.patient?.nama || "-"}
                        </p>
                        <p className="text-xs text-ink-soft">
                          {queue.registration?.doctor?.nama || "-"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={STATUS_VARIANT[queue.status] || "default"}
                          className="text-[10px]"
                        >
                          {queue.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </DashboardSection>
    </>
  );
};

export default DokterDashboardPage;