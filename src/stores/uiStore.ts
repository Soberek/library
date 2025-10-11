import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIStore {
  // Modal State
  isModalOpen: boolean;
  editingBookId: string | null;
  
  // View Mode
  viewMode: 'cards' | 'table';
  
  // Filter Panel
  isFilterPanelOpen: boolean;
  
  // Actions
  openModal: (bookId?: string | null) => void;
  closeModal: () => void;
  setViewMode: (mode: 'cards' | 'table') => void;
  toggleFilterPanel: () => void;
  setFilterPanelOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  devtools(
    (set) => ({
      // Initial State
      isModalOpen: false,
      editingBookId: null,
      viewMode: 'cards',
      isFilterPanelOpen: false,

      // Actions
      openModal: (bookId = null) =>
        set({ isModalOpen: true, editingBookId: bookId }, false, 'openModal'),

      closeModal: () =>
        set({ isModalOpen: false, editingBookId: null }, false, 'closeModal'),

      setViewMode: (mode) => set({ viewMode: mode }, false, 'setViewMode'),

      toggleFilterPanel: () =>
        set((state) => ({ isFilterPanelOpen: !state.isFilterPanelOpen }), false, 'toggleFilterPanel'),

      setFilterPanelOpen: (isOpen) =>
        set({ isFilterPanelOpen: isOpen }, false, 'setFilterPanelOpen'),
    }),
    { name: 'UIStore' }
  )
);

