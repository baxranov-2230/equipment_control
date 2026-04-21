import { useEffect } from 'react';
import { AppRoutes } from '@/routes';
import { useUIStore } from '@/store/ui.store';

function App() {
    const theme = useUIStore((s) => s.theme);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') root.classList.add('dark');
        else root.classList.remove('dark');
    }, [theme]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
            <AppRoutes />
        </div>
    );
}

export default App;
