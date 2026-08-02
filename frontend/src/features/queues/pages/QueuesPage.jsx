import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getNavItems } from "@/features/dashboard/config/roles";
import DashboardLayout from "@/features/dashboard/components/DashboardLayout";
import { QueueBoard } from "../components/QueueBoard";
import {
  useQueuesQuery,
  useCallQueueMutation,
  useUpdateQueueStatusMutation,
} from "../hooks/useQueues";

const QueuesPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading } = useQueuesQuery();
  const queues = data?.data ?? [];

  const callMutation = useCallQueueMutation();
  const updateStatusMutation = useUpdateQueueStatusMutation();

  const handleCall = async (queue) => {
    await callMutation.mutateAsync(queue.id);
  };

  const handleUpdateStatus = async (queue, newStatus) => {
    await updateStatusMutation.mutateAsync({
      id: queue.id,
      data: { status: newStatus },
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navItems = getNavItems(user?.role);

  return (
    <DashboardLayout onLogout={handleLogout} navItems={navItems}>
      <div className="space-y-6">
        <QueueBoard
          queues={queues}
          isLoading={isLoading}
          onCall={handleCall}
          onUpdateStatus={handleUpdateStatus}
          callLoadingId={callMutation.isPending ? callMutation.variables : null}
          statusLoadingId={
            updateStatusMutation.isPending
              ? updateStatusMutation.variables?.id
              : null
          }
        />
      </div>
    </DashboardLayout>
  );
};

export default QueuesPage;
