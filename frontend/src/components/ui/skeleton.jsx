import { cn } from '@/lib/utils';

/**
 * Skeleton — placeholder loading berbasis shimmer.
 */
function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-[8px] bg-outline-variant/60',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
