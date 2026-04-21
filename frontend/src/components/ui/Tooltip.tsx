import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface TooltipProps {
    content: ReactNode;
    children: ReactNode;
    side?: 'right' | 'left' | 'top' | 'bottom';
    disabled?: boolean;
}

export function Tooltip({ content, children, side = 'right', disabled }: TooltipProps) {
    const [open, setOpen] = useState(false);

    const positions: Record<string, string> = {
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    };

    const initial: Record<string, { opacity: number; x?: number; y?: number }> = {
        right: { opacity: 0, x: -4 },
        left: { opacity: 0, x: 4 },
        top: { opacity: 0, y: 4 },
        bottom: { opacity: 0, y: -4 },
    };

    return (
        <div
            className="relative inline-flex"
            onMouseEnter={() => !disabled && setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onFocus={() => !disabled && setOpen(true)}
            onBlur={() => setOpen(false)}
        >
            {children}
            <AnimatePresence>
                {open && !disabled && (
                    <motion.span
                        initial={initial[side]}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={initial[side]}
                        transition={{ duration: 0.12 }}
                        role="tooltip"
                        className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-slate-900 dark:bg-slate-700 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg ${positions[side]}`}
                    >
                        {content}
                    </motion.span>
                )}
            </AnimatePresence>
        </div>
    );
}
