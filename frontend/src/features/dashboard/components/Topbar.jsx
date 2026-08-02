import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  Settings,
  LogOut,
  UserRound,
  Users,
  ClipboardList,
  ListOrdered,
  Stethoscope,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "react-router-dom";
import { ROLE_LABELS } from "../config/roles";
import { getInitials } from "../utils/initials";
import React from "react";

const routeConfig = {
  "/dashboard": { label: "Dashboard", icon: LayoutDashboard },
  "/patients": { label: "Master Pasien", icon: Users },
  "/registrations": { label: "Pendaftaran Kunjungan", icon: ClipboardList },
  "/queues": { label: "Antrean Harian", icon: ListOrdered },
  "/medical-records": { label: "Pemeriksaan (SOAP)", icon: Stethoscope },
};

const getBreadcrumbs = (pathname) => {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return [{ label: "Beranda", href: "/dashboard" }];

  const crumbs = [{ label: "Beranda", href: "/dashboard" }];

  let currentPath = "";
  for (const part of parts) {
    currentPath += `/${part}`;
    const config = routeConfig[currentPath];
    if (config) {
      crumbs.push({ label: config.label, href: currentPath });
    } else {
      // Fallback for unknown routes
      crumbs.push({
        label: part.charAt(0).toUpperCase() + part.slice(1),
        href: currentPath,
      });
    }
  }

  return crumbs;
};

const Topbar = ({ user, onLogout }) => {
  const location = useLocation();
  const roleMeta = ROLE_LABELS[user.role];
  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-white/85 px-4 backdrop-blur md:px-6">
      <SidebarTrigger />

      <Breadcrumb className="min-w-0 flex-1">
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.href}>
              <BreadcrumbItem>
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={crumb.href}
                    className="flex items-center gap-1.5"
                  >
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifikasi"
          className="relative"
        >
          <Bell className="size-5" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-error" />
        </Button>

        <Separator orientation="vertical" className="h-7 border" />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={({ children, ...props }) => (
              <Button
                variant="ghost"
                className="h-auto gap-2 rounded-lg px-2 py-1"
                {...props}
              >
                {children}
              </Button>
            )}
          >
            <Avatar className="size-8">{getInitials(user.name)}</Avatar>
            <div className="hidden grid-cols-1 text-left leading-tight sm:grid">
              <span className="truncate text-sm font-semibold text-ink">
                {user.name}
              </span>
              <span className="truncate text-xs text-ink-muted">
                {roleMeta?.label ?? user.role}
              </span>
            </div>
            <ChevronDown className="size-4 text-ink-muted" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-56" align="end" sideOffset={8}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {getInitials(user.name)}
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium text-ink">
                    {user.name}
                  </span>
                  <span className="truncate text-xs text-ink-muted">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserRound className="size-4" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="size-4" />
                Pengaturan
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              className="text-error hover:bg-error-container hover:text-on-error-container"
            >
              <LogOut className="size-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Topbar;
