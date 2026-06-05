import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS } from '../../lib/constants';
import { useSettingsStore } from '../useSettingsStore';

describe('useSettingsStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useSettingsStore.setState({ settings: DEFAULT_SETTINGS });
  });

  it('starts with default settings', () => {
    expect(useSettingsStore.getState().settings).toEqual(DEFAULT_SETTINGS);
  });

  it('updates settings partially', () => {
    useSettingsStore.getState().updateSettings({ timeResolution: 15, startOfWeek: 'sun' });

    expect(useSettingsStore.getState().settings).toEqual({
      ...DEFAULT_SETTINGS,
      timeResolution: 15,
      startOfWeek: 'sun',
    });
  });

  it('persists settings to localStorage', () => {
    useSettingsStore.getState().updateSettings({ timeResolution: 15 });

    const stored = JSON.parse(localStorage.getItem('routine-settings')!);
    expect(stored.state.settings.timeResolution).toBe(15);
    expect(stored.version).toBe(1);
  });

  it('does not persist action functions', () => {
    useSettingsStore.getState().updateSettings({ timeResolution: 15 });

    const stored = JSON.parse(localStorage.getItem('routine-settings')!);
    expect(stored.state.updateSettings).toBeUndefined();
  });
});

describe('useSettingsStore hydration', () => {
  beforeEach(() => {
    localStorage.clear();
    useSettingsStore.setState({ settings: DEFAULT_SETTINGS });
  });

  it('hydrates from saved state in localStorage', () => {
    const saved = { timeResolution: 15, dayStart: 480, dayEnd: 1200, startOfWeek: 'sun' };
    localStorage.setItem('routine-settings', JSON.stringify({ state: { settings: saved }, version: 1 }));

    (useSettingsStore as any).persist.rehydrate();

    expect(useSettingsStore.getState().settings).toEqual(saved);
  });

  it('falls back to defaults when localStorage has malformed JSON', () => {
    localStorage.setItem('routine-settings', 'not-json');

    (useSettingsStore as any).persist.rehydrate();

    expect(useSettingsStore.getState().settings).toEqual(DEFAULT_SETTINGS);
  });
});
