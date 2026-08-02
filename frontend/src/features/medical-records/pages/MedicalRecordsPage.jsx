import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getNavItems } from "@/features/dashboard/config/roles";
import DashboardLayout from "@/features/dashboard/components/DashboardLayout";
import { queuesApi } from "@/features/queues/api/queuesApi";
import { MedicalRecordTable } from "../components/MedicalRecordTable";
import { SoapForm } from "../components/SoapForm";
import { useSubmitMedicalRecordMutation } from "../hooks/useMedicalRecords";

const MedicalRecordsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [examiningQueue, setExaminingQueue] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const { data: queuesData, isLoading: queuesLoading } = useQuery({
    queryKey: ["queues"],
    queryFn: () => queuesApi.getQueues(),
    refetchInterval: 10_000,
    refetchIntervalInBackground: false,
  });

  const allQueues = queuesData?.data ?? [];
  const availableQueues = allQueues.filter(
    (q) =>
      (q.status === "CheckIn" || q.status === "Pemeriksaan") &&
      (q.registration?.status === "CheckIn" ||
        q.registration?.status === "Pemeriksaan"),
  );

  const submitMutation = useSubmitMedicalRecordMutation();

  const handleExamine = (queue) => {
    if (queue.status !== "CheckIn" && queue.status !== "Pemeriksaan") return;
    if (
      queue.registration?.status !== "CheckIn" &&
      queue.registration?.status !== "Pemeriksaan"
    ) {
      return;
    }
    setExaminingQueue(queue);
    setSelectedRegistration(queue.registration);
    setSuccessMessage("");
  };

  const handleSubmitSoap = async (payload) => {
    await submitMutation.mutateAsync(payload);
    setSuccessMessage(
      `Rekam medis untuk ${selectedRegistration?.patient?.nama} berhasil disimpan.`,
    );
    setExaminingQueue(null);
    setSelectedRegistration(null);
  };

  const handleBack = () => {
    setExaminingQueue(null);
    setSelectedRegistration(null);
    setSuccessMessage("");
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navItems = getNavItems(user?.role);

  return (
    <DashboardLayout onLogout={handleLogout} navItems={navItems}>
      <div className="space-y-6">

        {successMessage && (
          <div
            role="status"
            className="flex items-center gap-2 rounded-[10px] border border-success/30 bg-success-container p-3 text-sm text-on-success-container"
          >
            <CheckCircle2 className="size-4 shrink-0" />
            {successMessage}
          </div>
        )}

        {selectedRegistration ? (
          <>
            <Button
              variant="ghost"
              onClick={handleBack}
              className="mb-2 h-9 w-fit"
            >
              <ArrowLeft className="mr-2 size-4" />
              Kembali ke daftar
            </Button>
            <SoapForm
              registration={selectedRegistration}
              onSave={handleSubmitSoap}
              isLoading={submitMutation.isPending}
            />
          </>
        ) : (
          <MedicalRecordTable
            queues={availableQueues}
            isLoading={queuesLoading}
            onExamine={handleExamine}
            examiningId={examiningQueue?.id}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default MedicalRecordsPage;