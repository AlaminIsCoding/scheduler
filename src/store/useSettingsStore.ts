import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_SETTINGS } from '../lib/constants';
import type { Settings } from '../types';

interface SettingsStore {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      updateSettings: (settings) => {
        set((state) => {
          const next = { ...state.settings, ...settings };
          if (next.dayStart >= next.dayEnd) {
            throw new Error('Day start must be before day end.');
          }
          return { settings: next };
        });
      },
    }),
    {
      name: 'routine-settings',
      version: 1,
      partialize: (state) => ({ settings: state.settings }),
    },
  ),
);
