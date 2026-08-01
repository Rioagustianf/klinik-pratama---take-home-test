import { useAuth } from "@/context/AuthContext";
import { SidebarProvider, Sidebar } from "@/components/ui/sidebar";
import SidebarNav from "./SidebarNav";
import Topbar from "./Topbar";
import { getNavItems } from "../config/roles";

const DashboardLayout = ({ children, onLogout }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const navItems = getNavItems(user.role);
  const handleLogout = () => {
    if (typeof onLogout === "function") onLogout();
    logout();
  };

  return (
    <SidebarProvider>
      <Sidebar className="lg:sticky lg:top-0 lg:h-svh">
        <SidebarNav user={user} items={navItems} />
      </Sidebar>

      <div className="flex min-w-0 flex-1 flex-col bg-surface">
        <Topbar user={user} onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto w-full max-w-7xl space-y-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
