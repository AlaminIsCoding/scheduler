import { describe, expect, it } from 'vitest';
import type { RoutineEvent, Settings } from '../../types';
import type { Category, DayOfWeek } from '../../types';
import {
  exportToJSON,
  importFromJSON,
  parseImportJSON,
  isValidRoutineEvent,
  isValidCategory,
  isValidSettings,
  ImportError,
} from '../io';

const sampleEvents: RoutineEvent[] = [
  {
    id: '1',
    title: 'Morning run',
    day: 'mon' as DayOfWeek,
    startMinutes: 360,
    endMinutes: 420,
    categoryId: 'health',
    color: '#22c55e',
  },
  {
    id: '2',
    title: 'Team standup',
    day: 'mon' as DayOfWeek,
    startMinutes: 540,
    endMinutes: 570,
    categoryId: 'work',
    color: '#6366f1',
  },
];

const sampleCategories: Category[] = [
  { id: 'health', name: 'Health', color: '#22c55e' },
  { id: 'work', name: 'Work', color: '#6366f1' },
];

const sampleSettings: Settings = {
  timeResolution: 30,
  dayStart: 360,
  dayEnd: 1380,
  startOfWeek: 'mon',
};

describe('exportToJSON', () => {
  it('produces valid JSON with version, events, categories, and settings', () => {
    const json = exportToJSON(sampleEvents, sampleCategories, sampleSettings);
    const parsed = JSON.parse(json);
    expect(parsed).toHaveProperty('version', 1);
    expect(parsed).toHaveProperty('events');
    expect(parsed).toHaveProperty('categories');
    expect(parsed).toHaveProperty('settings');
    expect(parsed.events).toHaveLength(2);
    expect(parsed.categories).toHaveLength(2);
  });
});

describe('round-trip', () => {
  it('export then import produces identical data', () => {
    const json = exportToJSON(sampleEvents, sampleCategories, sampleSettings);
    const result = importFromJSON(json);
    expect(result.events).toEqual(sampleEvents);
    expect(result.categories).toEqual(sampleCategories);
    expect(result.settings).toEqual(sampleSettings);
    expect(result.version).toBe(1);
  });

  it('parseImportJSON succeeds on valid data', () => {
    const json = exportToJSON(sampleEvents, sampleCategories, sampleSettings);
    const result = parseImportJSON(json);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.events).toEqual(sampleEvents);
    }
  });
});

describe('malformed JSON', () => {
  it('rejects unparseable string', () => {
    expect(() => importFromJSON('not valid json')).toThrow(ImportError);
    const result = parseImportJSON('not valid json');
    expect(result.success).toBe(false);
  });

  it('rejects null', () => {
    const result = parseImportJSON('null');
    expect(result.success).toBe(false);
  });

  it('rejects plain array', () => {
    const result = parseImportJSON('[]');
    expect(result.success).toBe(false);
  });

  it('rejects missing version', () => {
    const data = {
      events: sampleEvents,
      categories: sampleCategories,
      settings: sampleSettings,
    };
    const result = parseImportJSON(JSON.stringify(data));
    expect(result.success).toBe(false);
  });

  it('rejects wrong version', () => {
    const data = {
      version: 99,
      events: sampleEvents,
      categories: sampleCategories,
      settings: sampleSettings,
    };
    const result = parseImportJSON(JSON.stringify(data));
    expect(result.success).toBe(false);
  });

  it('rejects missing events', () => {
    const data = {
      version: 1,
      categories: sampleCategories,
      settings: sampleSettings,
    };
    const result = parseImportJSON(JSON.stringify(data));
    expect(result.success).toBe(false);
  });

  it('rejects missing categories', () => {
    const data = {
      version: 1,
      events: sampleEvents,
      settings: sampleSettings,
    };
    const result = parseImportJSON(JSON.stringify(data));
    expect(result.success).toBe(false);
  });

  it('rejects missing settings', () => {
    const data = {
      version: 1,
      events: sampleEvents,
      categories: sampleCategories,
    };
    const result = parseImportJSON(JSON.stringify(data));
    expect(result.success).toBe(false);
  });

  it('rejects events with missing title', () => {
    const badEvents = [{ id: '1', day: 'mon', startMinutes: 360, endMinutes: 420, categoryId: 'health', color: '#22c55e' }];
    const data = { version: 1, events: badEvents, categories: sampleCategories, settings: sampleSettings };
    const result = parseImportJSON(JSON.stringify(data));
    expect(result.success).toBe(false);
  });

  it('rejects events with invalid day', () => {
    const badEvents = [{ id: '1', title: 'Test', day: 'xyz', startMinutes: 360, endMinutes: 420, categoryId: 'health', color: '#22c55e' }];
    const data = { version: 1, events: badEvents, categories: sampleCategories, settings: sampleSettings };
    const result = parseImportJSON(JSON.stringify(data));
    expect(result.success).toBe(false);
  });

  it('rejects events with end before start', () => {
    const badEvents = [{ id: '1', title: 'Test', day: 'mon', startMinutes: 420, endMinutes: 360, categoryId: 'health', color: '#22c55e' }];
    const data = { version: 1, events: badEvents, categories: sampleCategories, settings: sampleSettings };
    const result = parseImportJSON(JSON.stringify(data));
    expect(result.success).toBe(false);
  });

  it('rejects events with non-numeric minutes', () => {
    const badEvents = [{ id: '1', title: 'Test', day: 'mon', startMinutes: 'abc', endMinutes: 420, categoryId: 'health', color: '#22c55e' }];
    const data = { version: 1, events: badEvents, categories: sampleCategories, settings: sampleSettings };
    const result = parseImportJSON(JSON.stringify(data));
    expect(result.success).toBe(false);
  });

  it('rejects events with negative startMinutes', () => {
    const badEvents = [{ id: '1', title: 'Test', day: 'mon', startMinutes: -1, endMinutes: 420, categoryId: 'health', color: '#22c55e' }];
    const data = { version: 1, events: badEvents, categories: sampleCategories, settings: sampleSettings };
    const result = parseImportJSON(JSON.stringify(data));
    expect(result.success).toBe(false);
  });

  it('rejects events with minutes over 1440', () => {
    const badEvents = [{ id: '1', title: 'Test', day: 'mon', startMinutes: 1441, endMinutes: 1500, categoryId: 'health', color: '#22c55e' }];
    const data = { version: 1, events: badEvents, categories: sampleCategories, settings: sampleSettings };
    const result = parseImportJSON(JSON.stringify(data));
    expect(result.success).toBe(false);
  });

  it('rejects events with empty id', () => {
    const badEvents = [{ id: '', title: 'Test', day: 'mon', startMinutes: 360, endMinutes: 420, categoryId: 'health', color: '#22c55e' }];
    const data = { version: 1, events: badEvents, categories: sampleCategories, settings: sampleSettings };
    const result = parseImportJSON(JSON.stringify(data));
    expect(result.success).toBe(false);
  });

  it('rejects categories with missing name', () => {
    const badCategories = [{ id: 'c1', color: '#000' }];
    const data = { version: 1, events: sampleEvents, categories: badCategories, settings: sampleSettings };
    const result = parseImportJSON(JSON.stringify(data));
    expect(result.success).toBe(false);
  });

  it('rejects settings with invalid timeResolution', () => {
    const badSettings = { timeResolution: 7, dayStart: 360, dayEnd: 1380, startOfWeek: 'mon' };
    const data = { version: 1, events: sampleEvents, categories: sampleCategories, settings: badSettings };
    const result = parseImportJSON(JSON.stringify(data));
    expect(result.success).toBe(false);
  });

  it('rejects settings with dayEnd <= dayStart', () => {
    const badSettings = { timeResolution: 30, dayStart: 600, dayEnd: 600, startOfWeek: 'mon' };
    const data = { version: 1, events: sampleEvents, categories: sampleCategories, settings: badSettings };
    const result = parseImportJSON(JSON.stringify(data));
    expect(result.success).toBe(false);
  });

  it('rejects settings with invalid startOfWeek', () => {
    const badSettings = { timeResolution: 30, dayStart: 360, dayEnd: 1380, startOfWeek: 'tue' };
    const data = { version: 1, events: sampleEvents, categories: sampleCategories, settings: badSettings };
    const result = parseImportJSON(JSON.stringify(data));
    expect(result.success).toBe(false);
  });
});

describe('isValidRoutineEvent', () => {
  it('returns true for a valid event', () => {
    expect(isValidRoutineEvent(sampleEvents[0])).toBe(true);
  });

  it('returns false for null', () => {
    expect(isValidRoutineEvent(null)).toBe(false);
  });

  it('returns false for a string', () => {
    expect(isValidRoutineEvent('event')).toBe(false);
  });
});

describe('isValidCategory', () => {
  it('returns true for a valid category', () => {
    expect(isValidCategory(sampleCategories[0])).toBe(true);
  });

  it('returns false for null', () => {
    expect(isValidCategory(null)).toBe(false);
  });
});

describe('isValidSettings', () => {
  it('returns true for valid settings', () => {
    expect(isValidSettings(sampleSettings)).toBe(true);
  });

  it('returns false for null', () => {
    expect(isValidSettings(null)).toBe(false);
  });
});
