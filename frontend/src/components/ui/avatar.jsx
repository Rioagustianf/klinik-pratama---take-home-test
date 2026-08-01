import * as React from 'react';
import { Avatar as BaseAvatar } from '@base-ui/react';
import { cn } from '@/lib/utils';

/**
 * Avatar — membungkus Base UI Avatar agar ikut design system SIMKLINIK.
 * Base UI akan mengganti `hidden src` dengan Fallback ketika gambar error.
 */
const Avatar = React.forwardRef(
  ({ className, size = 'md', children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'size-8 text-xs',
      md: 'size-10 text-sm',
      lg: 'size-12 text-base',
    }[size];

    return (
      <BaseAvatar.Root
        ref={ref}
        className={cn(
          'relative inline-flex shrink-0 overflow-hidden rounded-full bg-primary-container/15',
          sizeClasses,
          className
        )}
        {...props}
      >
        <BaseAvatar.Image className="size-full object-cover" />
        <BaseAvatar.Fallback
          delayMs={600}
          className={cn(
            'flex size-full items-center justify-center bg-primary-container/15 font-semibold uppercase text-brand-700',
            className
          )}
        >
          {children}
        </BaseAvatar.Fallback>
      </BaseAvatar.Root>
    );
  }
);
Avatar.displayName = 'Avatar';

export { Avatar };
