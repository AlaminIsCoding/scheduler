import { create } from 'zustand';

export type ActivePage = 'today' | 'weekly' | 'settings' | 'usage';

interface NavigationStore {
  activePage: ActivePage;
  setActivePage: (activePage: ActivePage) => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  activePage: 'today',
  setActivePage: (activePage) => {
    set({ activePage });
  },
}));
