
import type { LucideIcon } from 'lucide-react';
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
        <div className={cn("bg-white dark:bg-slate-900 overflow-hidden shadow-sm rounded-xl border border-slate-200 dark:border-slate-800 p-5", className)}>
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/20">
                        <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                    </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="truncate text-sm font-medium text-slate-500 dark:text-slate-400">{title}</dt>
                        <dd>
                            <div className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</div>
                        </dd>
                    </dl>
                </div>
            </div>
            {trend && (
                <div className="mt-4">
                    <span className={cn(
                        "text-sm font-medium",
                        trend.isUp ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    )}>
                        {trend.value}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">oldingi oydan</span>
                </div>
            )}
        </div>
    );
}
