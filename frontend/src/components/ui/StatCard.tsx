import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from './utils/button';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: string;
        isUp: boolean;
    };
    className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
                className
            )}
        >
            <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                        {title}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        {value}
                    </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/15 to-primary-500/5 ring-1 ring-primary-500/10">
                    <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" aria-hidden />
                </div>
            </div>

            {trend && (
                <div className="mt-4 flex items-center gap-2">
                    <span
                        className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                            trend.isUp
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                        )}
                    >
                        {trend.isUp ? (
                            <ArrowUpRight className="h-3 w-3" />
                        ) : (
                            <ArrowDownRight className="h-3 w-3" />
                        )}
                        {trend.value}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">oldingi oydan</span>
                </div>
            )}

            <div className="pointer-events-none absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
    );
}
