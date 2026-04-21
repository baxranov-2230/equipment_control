import { cn } from './utils/button';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-md bg-slate-200/70 dark:bg-slate-800/70',
                className
            )}
            {...props}
        />
    );
}
