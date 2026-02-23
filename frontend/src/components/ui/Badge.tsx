import React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { badgeVariants } from './utils/badge';
import { cn } from './utils/button';

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

export function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}
