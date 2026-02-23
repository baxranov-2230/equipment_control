import React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { buttonVariants, cn } from './utils/button';

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? "div" : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                // @ts-expect-error Ignoring polymorphic ref mismatch temporarily
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";
