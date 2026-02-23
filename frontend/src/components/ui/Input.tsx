import React from 'react';
import { cn } from './utils/button';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, ...props }, ref) => {
        return (
            <div className="w-full relative">
                <input
                    type={type}
                    className={cn(
                        'flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-primary-500',
                        error && 'border-red-500 focus-visible:ring-red-500',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="absolute -bottom-5 left-0 text-xs text-red-500">{error}</p>
                )}
            </div>
        );
    }
);
Input.displayName = 'Input';

export { Input };
