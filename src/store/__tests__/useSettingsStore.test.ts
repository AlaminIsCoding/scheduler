import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS } from '../../lib/constants';
import { useSettingsStore } from '../useSettingsStore';

describe('useSettingsStore', () => {
  beforeEach(() => {
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
});
