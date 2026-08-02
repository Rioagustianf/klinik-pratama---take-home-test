import { useQuery } from "@tanstack/react-query";
import { UserPlus, ListOrdered, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { BarChartComponent } from "@/components/ui/chart";
import StatCard from "../components/StatCard";
import DashboardSection from "../components/DashboardSection";
import { useDashboardQuery } from "../hooks/useDashboard";
import { queuesApi } from "@/features/queues/api/queuesApi";

const STATUS_VARIANT = {
  Menunggu: "warning",
  CheckIn: "primary",
  Pemeriksaan: "secondary",
  Selesai: "success",
  Batal: "destructive",
};

const PetugasDashboardPage = () => {
  const { data, isLoading } = useDashboardQuery();
  const stats = data?.data;

  const { data: queuesData, isLoading: queuesLoading } = useQuery({
    queryKey: ["queues"],
    queryFn: () => queuesApi.getQueues(),
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
  });
  const queues = queuesData?.data ?? [];

  const barData = [
    { status: "Menunggu", count: queues.filter((q) => q.status === "Menunggu").length },
    { status: "CheckIn", count: queues.filter((q) => q.status === "CheckIn").length },
    { status: "Pemeriksaan", count: queues.filter((q) => q.status === "Pemeriksaan").length },
    { status: "Selesai", count: queues.filter((q) => q.status === "Selesai").length },
    { status: "Batal", count: queues.filter((q) => q.status === "Batal").length },
  ].filter((d) => d.count > 0);

  const metrics = [
    {
      id: "baru",
      label: "Pasien Baru Hari Ini",
      value: stats?.new_patients_today,
      description: "Terdaftar pada hari berjalan (PRD DSH-02)",
      icon: UserPlus,
      tone: "success",
    },
    {
      id: "antrean",
      label: "Total Antrean Hari Ini",
      value: stats?.queues_today,
      description: "Nomor antrean digenerate hari ini (PRD DSH-03)",
      icon: ListOrdered,
      tone: "primary",
    },
    {
      id: "menunggu",
      label: "Antrean Menunggu",
      value: stats?.active_queues,
      description: "Menunggu / CheckIn untuk koordinasi loket (PRD DSH-04)",
      icon: Clock,
      tone: "warning",
    },
    {
      id: "selesai",
      label: "Kunjungan Selesai",
      value: stats?.completed_today,
      description: "Kunjungan selesai hari ini (PRD DSH-05)",
      icon: CheckCircle2,
      tone: "destructive",
    },
  ];

  return (
    <>
      <DashboardSection
        title="Ringkasan Operasional"
        description="Pemantauan antrean & pendaftaran hari berjalan"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
            <CardDescription>Status antrean pasien hari ini</CardDescription>
          </CardHeader>
          <CardContent>
            {queuesLoading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : barData.length === 0 ? (
              <p className="py-10 text-center text-sm text-ink-muted">
                Belum ada antrean hari ini.
              </p>
            ) : (
              <BarChartComponent data={barData} height={250} />
            )}
          </CardContent>
        </Card>

        {/* Tabel antrean terbaru */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Antrean Hari Ini</CardTitle>
            <CardDescription>Daftar antrean yang perlu dipantau</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {queuesLoading ? (
              <div className="space-y-3 p-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : queues.length === 0 ? (
              <p className="py-10 text-center text-sm text-ink-muted">
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
                  {queues.slice(0, 6).map((queue) => (
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
      </div>
    </>
  );
};

export default PetugasDashboardPage;