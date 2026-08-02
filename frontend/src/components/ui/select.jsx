import * as React from "react";
import { Select as BaseSelect } from "@base-ui/react";
import { cn } from "@/lib/utils";

const Select = BaseSelect.Root;

const SelectTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <BaseSelect.Trigger
    ref={ref}
    className={cn(
      "flex h-11 w-full items-center justify-between rounded-[10px] border border-line bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className,
    )}
    {...props}
  />
));
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = BaseSelect.Value;

const SelectContent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <BaseSelect.Portal>
      <BaseSelect.Positioner className="z-50">
        <BaseSelect.Popup
          ref={ref}
          className={cn(
            "relative z-50 max-h-96 min-w-32 overflow-hidden rounded-[12px] border border-line bg-white text-ink shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
            className,
          )}
          {...props}
        >
          <BaseSelect.List className="p-1.5">{children}</BaseSelect.List>
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  ),
);
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef(({ className, ...props }, ref) => (
  <BaseSelect.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-[8px] py-2 pl-3 pr-3 text-sm outline-none transition-colors focus:bg-surface focus:text-ink data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[highlighted=true]:bg-surface data-[highlighted=true]:text-ink",
      className,
    )}
    {...props}
  />
));
SelectItem.displayName = "SelectItem";

const SelectGroup = BaseSelect.Group;

const SelectGroupLabel = React.forwardRef(({ className, ...props }, ref) => (
  <BaseSelect.GroupLabel
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-xs font-semibold text-ink-muted",
      className,
    )}
    {...props}
  />
));
SelectGroupLabel.displayName = "SelectGroupLabel";

const SelectScrollUpArrow = BaseSelect.ScrollUpArrow;
const SelectScrollDownArrow = BaseSelect.ScrollDownArrow;
const SelectArrow = BaseSelect.Arrow;

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectGroupLabel,
  SelectScrollUpArrow,
  SelectScrollDownArrow,
  SelectArrow,
};
