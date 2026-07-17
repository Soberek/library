import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface UIStore {
  viewMode: 'cards' | 'table';
  setViewMode: (mode: 'cards' | 'table') => void;
}

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set) => ({
        viewMode: 'cards',
        setViewMode: (mode) => set({ viewMode: mode }, false, 'setViewMode'),
      }),
      {
        name: 'mylibrary-ui',
        partialize: (state) => ({ viewMode: state.viewMode }),
      },
    ),
    { name: 'UIStore' },
  ),
);
