import { Separator as BaseSeparator } from '@base-ui/react';
import { cn } from '@/lib/utils';

/**
 * Separator — pembatas visual vertikal/horizontal.
 */
function Separator({ className, orientation = 'horizontal', ...props }) {
  return (
    <BaseSeparator
      orientation={orientation}
      className={cn(
        'shrink-0 bg-outline-variant',
        orientation === 'horizontal'
          ? 'h-px w-full'
          : 'h-full w-px',
        className
      )}
      {...props}
    />
  );
}

export { Separator };
