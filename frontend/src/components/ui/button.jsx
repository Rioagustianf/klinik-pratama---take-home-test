import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-600 disabled:pointer-events-none disabled:opacity-60 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-brand-600 text-white hover:bg-brand-700 shadow-md shadow-brand-600/20',
        destructive: 'bg-danger-500 text-white hover:bg-danger-700 shadow-sm',
        outline: 'border border-line bg-white text-ink hover:bg-surface hover:text-brand-600',
        secondary: 'bg-surface border border-line text-ink-soft hover:bg-brand-50 hover:border-brand-600/50',
        ghost: 'hover:bg-brand-50 hover:text-brand-600',
        link: 'text-brand-600 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-12 px-4 py-2',
        sm: 'h-9 rounded-[8px] px-3 text-xs',
        lg: 'h-14 rounded-[12px] px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = 'Button';

export { Button, buttonVariants };
