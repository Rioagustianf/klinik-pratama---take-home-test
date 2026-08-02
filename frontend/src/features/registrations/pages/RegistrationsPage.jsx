import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getNavItems } from "@/features/dashboard/config/roles";
import DashboardLayout from "@/features/dashboard/components/DashboardLayout";
import { patientsApi } from "@/features/patients/api/patientsApi";
import { RegistrationForm } from "../components/RegistrationForm";
import { RegistrationTable } from "../components/RegistrationTable";
import {
  useRegistrationsQuery,
  useDoctorsQuery,
  useCreateRegistrationMutation,
} from "../hooks/useRegistrations";

const STATUS_OPTIONS = [
  "Menunggu",
  "CheckIn",
  "Pemeriksaan",
  "Selesai",
  "Batal",
];

const RegistrationsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tanggal, setTanggal] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [status, setStatus] = useState("");

  const { data: patientsData } = useQuery({
    queryKey: ["patients", { page: 1, limit: 100 }],
    queryFn: () => patientsApi.getPatients({ page: 1, limit: 100 }),
    keepPreviousData: true,
  });
  const patients = patientsData?.data?.data ?? [];
  const { data: doctorsData } = useDoctorsQuery();
  const doctors = doctorsData?.data ?? [];

  const { data: regData, isLoading } = useRegistrationsQuery({
    tanggal,
    status,
  });
  const registrations = regData?.data?.data ?? [];

  const createMutation = useCreateRegistrationMutation();

  const handleCreate = async (payload) => {
    await createMutation.mutateAsync(payload);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navItems = getNavItems(user?.role);

  return (
    <DashboardLayout onLogout={handleLogout} navItems={navItems}>
      <div className="space-y-6">
        <RegistrationForm
          patients={patients}
          doctors={doctors}
          onSave={handleCreate}
          isLoading={createMutation.isPending}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="h-11 rounded-[10px] border border-line bg-white pl-10 pr-4 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-11 rounded-[10px] border border-line bg-white px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-600"
            >
              <option value="">Semua Status</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <RegistrationTable
          registrations={registrations}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
};

export default RegistrationsPage;
