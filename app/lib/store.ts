import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface StoreState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useStore = create<StoreState>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
})); 
