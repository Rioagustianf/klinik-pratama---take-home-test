import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const TONE_STYLES = {
  primary: "bg-brand-600 text-white",
  secondary: "bg-brand-50 text-brand-700",
  success: "bg-success-container text-on-success-container",
  warning: "bg-warning-container text-on-warning-container",
  destructive: "bg-error-container text-on-error-container",
};

const StatCard = ({
  label,
  value,
  icon: Icon,
  tone = "primary",
  isLoading = false,
  className,
}) => {
  const iconStyle = TONE_STYLES[tone] ?? TONE_STYLES.primary;

  return (
    <div
      className={cn(
        "rounded-[16px] border border-line bg-white p-5 shadow-[0_4px_12px_rgba(15,110,110,0.05)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
            {label}
          </p>
          {isLoading ? (
            <Skeleton className="mt-2 h-8 w-24" />
          ) : (
            <p className="mt-1 text-3xl font-semibold tracking-tight text-ink">
              {value}
            </p>
          )}
        </div>

        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-[12px]",
            iconStyle,
          )}
        >
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
