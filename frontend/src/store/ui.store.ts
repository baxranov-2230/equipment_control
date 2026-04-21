import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface UIState {
    theme: Theme;
    sidebarCollapsed: boolean;
    mobileSidebarOpen: boolean;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
    openMobileSidebar: () => void;
    closeMobileSidebar: () => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set, get) => ({
            theme: 'light',
            sidebarCollapsed: false,
            mobileSidebarOpen: false,
            setTheme: (theme) => {
                applyTheme(theme);
                set({ theme });
            },
            toggleTheme: () => {
                const next: Theme = get().theme === 'light' ? 'dark' : 'light';
                applyTheme(next);
                set({ theme: next });
            },
            toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
            setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
            openMobileSidebar: () => set({ mobileSidebarOpen: true }),
            closeMobileSidebar: () => set({ mobileSidebarOpen: false }),
        }),
        {
            name: 'ui-preferences',
            partialize: (state) => ({
                theme: state.theme,
                sidebarCollapsed: state.sidebarCollapsed,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) applyTheme(state.theme);
            },
        }
    )
);

function applyTheme(theme: Theme) {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
}
