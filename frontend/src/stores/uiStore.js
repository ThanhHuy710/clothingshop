import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isMenuDrawerOpen: false,
  setMenuDrawerOpen: (isOpen) => set({ isMenuDrawerOpen: isOpen }),
  
  isFilterSheetOpen: false,
  setFilterSheetOpen: (isOpen) => set({ isFilterSheetOpen: isOpen }),
}));
