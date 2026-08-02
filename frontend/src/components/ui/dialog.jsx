import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react";
import { cn } from "@/lib/utils";

const Dialog = BaseDialog.Root;

const DialogTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <BaseDialog.Trigger
    ref={ref}
    className={cn("outline-none", className)}
    {...props}
  />
));
DialogTrigger.displayName = "DialogTrigger";

const DialogPortal = BaseDialog.Portal;

const DialogBackdrop = React.forwardRef(({ className, ...props }, ref) => (
  <BaseDialog.Backdrop
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]",
      className,
    )}
    {...props}
  />
));
DialogBackdrop.displayName = "DialogBackdrop";

const DialogPopup = React.forwardRef(({ className, ...props }, ref) => (
  <BaseDialog.Popup
    ref={ref}
    className={cn(
      "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-[16px] border border-line bg-white p-6 shadow-[0_8px_30px_rgba(15,110,110,0.12)] outline-none",
      className,
    )}
    {...props}
  />
));
DialogPopup.displayName = "DialogPopup";

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <BaseDialog.Title
    ref={ref}
    className={cn("text-lg font-bold text-ink leading-none tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <BaseDialog.Description
    ref={ref}
    className={cn("text-sm text-ink-muted mt-1.5", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

const DialogClose = React.forwardRef(({ className, ...props }, ref) => (
  <BaseDialog.Close
    ref={ref}
    className={cn("outline-none", className)}
    {...props}
  />
));
DialogClose.displayName = "DialogClose";

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogBackdrop,
  DialogPopup,
  DialogTitle,
  DialogDescription,
  DialogClose,
};