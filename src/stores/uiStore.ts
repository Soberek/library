import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface UIStore {
  viewMode: 'cards' | 'table';
  setViewMode: (mode: 'cards' | 'table') => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
}

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set) => ({
        viewMode: 'cards',
        setViewMode: (mode) => set({ viewMode: mode }, false, 'setViewMode'),
        sidebarCollapsed: false,
        setSidebarCollapsed: (collapsed) =>
          set({ sidebarCollapsed: collapsed }, false, 'setSidebarCollapsed'),
        toggleSidebar: () =>
          set(
            (state) => ({ sidebarCollapsed: !state.sidebarCollapsed }),
            false,
            'toggleSidebar',
          ),
        commandPaletteOpen: false,
        setCommandPaletteOpen: (open) =>
          set({ commandPaletteOpen: open }, false, 'setCommandPaletteOpen'),
        toggleCommandPalette: () =>
          set(
            (state) => ({ commandPaletteOpen: !state.commandPaletteOpen }),
            false,
            'toggleCommandPalette',
          ),
      }),
      {
        name: 'mylibrary-ui',
        partialize: (state) => ({
          viewMode: state.viewMode,
          sidebarCollapsed: state.sidebarCollapsed,
        }),
      },
    ),
    { name: 'UIStore' },
  ),
);

export default useUIStore;
