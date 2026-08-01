import { cn } from "@/lib/utils";

const DashboardSection = ({ action, children, className }) => {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </section>
  );
};

export default DashboardSection;
