import { NavLink } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";
import { BRAND } from "../config/roles";

const SidebarNav = ({ items, onNavigate }) => {
  const { collapsed } = useSidebar();
  const BrandIcon = BRAND.icon;

  return (
    <>
      <div className="flex items-center gap-3 px-4 py-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-brand-600 text-white">
          <BrandIcon className="size-5" />
        </div>
        {!collapsed && (
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-bold tracking-tight text-ink">
              {BRAND.name}
            </p>
            <p className="truncate text-xs font-medium text-brand-700">
              {BRAND.sub}
            </p>
          </div>
        )}
      </div>

      <div className="mx-3 h-px bg-outline-variant" />

      <div className="flex-1 overflow-y-auto py-3">
        <div className="px-3 mb-2">
          {!collapsed && (
            <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-widest text-ink-muted">
              Menu
            </p>
          )}
        </div>

        <nav className="flex flex-col gap-1 px-3">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-600 ${
                  collapsed ? "justify-center px-2" : ""
                } ${
                  isActive
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-ink-soft hover:bg-sidebar-hover hover:text-ink"
                }`
              }
            >
              <item.icon className="size-4.5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default SidebarNav;
