import * as React from "react";
import { Menu } from "@base-ui/react";
import { cn } from "@/lib/utils";

const DropdownMenu = Menu.Root;

/**
 * Base UI memakai prop `render`, bukan `asChild`, untuk komposisi.
 * `asChild` diteruskan ke DOM dan menyebabkan <button> bersarang.
 */
const DropdownMenuTrigger = React.forwardRef(({ className, render, ...props }, ref) => (
  <Menu.Trigger
    ref={ref}
    render={render}
    className={cn(
      "inline-flex items-center justify-center outline-none focus:outline-none",
      className,
    )}
    {...props}
  />
));
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = React.forwardRef(
  ({ className, sideOffset = 8, align = "end", ...props }, ref) => (
    <Menu.Portal>
      <Menu.Positioner align={align} sideOffset={sideOffset}>
        <Menu.Popup
          ref={ref}
          className={cn(
            "z-50 min-w-48 overflow-hidden rounded-[12px] border border-line bg-white p-1.5 text-ink shadow-lg outline-none animate-login-rise",
            className,
          )}
          {...props}
        />
      </Menu.Positioner>
    </Menu.Portal>
  ),
);
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef(
  ({ className, inset, ...props }, ref) => (
    <Menu.Item
      ref={ref}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-[8px] px-3 py-2 text-sm text-ink-soft outline-none transition-colors hover:bg-surface hover:text-ink focus:bg-surface focus:text-ink data-disabled:pointer-events-none data-disabled:opacity-50",
        inset && "pl-8",
        className,
      )}
      {...props}
    />
  ),
);
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuLabel = React.forwardRef(
  ({ className, inset, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "px-3 py-1.5 text-xs font-semibold text-ink-muted",
        inset && "pl-8",
        className,
      )}
      {...props}
    />
  ),
);
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-0.5", className)}
    {...props}
  />
));
DropdownMenuGroup.displayName = "DropdownMenuGroup";

const DropdownMenuSeparator = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("-mx-1.5 my-1 h-px bg-line", className)}
      {...props}
    />
  ),
);
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
};
