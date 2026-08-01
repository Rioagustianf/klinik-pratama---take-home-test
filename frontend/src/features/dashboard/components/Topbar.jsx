import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  Settings,
  LogOut,
  UserRound,
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
import { ROLE_LABELS } from "../config/roles";
import { getInitials } from "../utils/initials";

const Topbar = ({ user, onLogout }) => {
  const roleMeta = ROLE_LABELS[user.role];

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-white/85 px-4 backdrop-blur md:px-6">
      <SidebarTrigger />

      <Breadcrumb className="min-w-0 flex-1">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/dashboard"
              className="flex items-center gap-1.5"
            >
              <LayoutDashboard className="size-4" />
              Beranda
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Button
        variant="ghost"
        size="icon"
        aria-label="Notifikasi"
        className="relative"
      >
        <Bell className="size-5" />
        <span className="absolute right-2 top-2 size-2 rounded-full bg-error" />
      </Button>

      <Separator orientation="vertical" className="h-7 border " />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-auto gap-2 rounded-lg px-2 py-1">
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
          </Button>
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
    </header>
  );
};

export default Topbar;
