import type { Category, DayOfWeek, RoutineEvent, Settings } from '../types';

const CURRENT_VERSION = 1;

const VALID_DAYS: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const VALID_RESOLUTIONS = [15, 30, 60] as const;
const VALID_START_OF_WEEK = ['mon', 'sun'] as const;

export interface ExportData {
  version: number;
  events: RoutineEvent[];
  categories: Category[];
  settings: Settings;
}

export function exportToJSON(
  events: RoutineEvent[],
  categories: Category[],
  settings: Settings,
): string {
  const data: ExportData = {
    version: CURRENT_VERSION,
    events,
    categories,
    settings,
  };
  return JSON.stringify(data, null, 2);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

function isValidDay(value: unknown): value is DayOfWeek {
  return VALID_DAYS.includes(value as DayOfWeek);
}

function isValidTimeResolution(value: unknown): value is 15 | 30 | 60 {
  return VALID_RESOLUTIONS.includes(value as 15 | 30 | 60);
}

function isValidStartOfWeek(value: unknown): value is 'mon' | 'sun' {
  return VALID_START_OF_WEEK.includes(value as 'mon' | 'sun');
}

export function isValidRoutineEvent(value: unknown): value is RoutineEvent {
  if (!isRecord(value)) return false;
  if (!isString(value.id) || value.id === '') return false;
  if (!isString(value.title) || value.title === '') return false;
  if (!isValidDay(value.day)) return false;
  if (!isNumber(value.startMinutes) || value.startMinutes < 0 || value.startMinutes > 1440) return false;
  if (!isNumber(value.endMinutes) || value.endMinutes < 0 || value.endMinutes > 1440) return false;
  if (value.endMinutes <= value.startMinutes) return false;
  if (!isString(value.categoryId) || value.categoryId === '') return false;
  if (!isString(value.color)) return false;
  return true;
}

export function isValidCategory(value: unknown): value is Category {
  if (!isRecord(value)) return false;
  if (!isString(value.id) || value.id === '') return false;
  if (!isString(value.name) || value.name === '') return false;
  if (!isString(value.color)) return false;
  return true;
}

export function isValidSettings(value: unknown): value is Settings {
  if (!isRecord(value)) return false;
  if (!isValidTimeResolution(value.timeResolution)) return false;
  if (!isNumber(value.dayStart) || value.dayStart < 0 || value.dayStart > 1440) return false;
  if (!isNumber(value.dayEnd) || value.dayEnd < 0 || value.dayEnd > 1440) return false;
  if (value.dayEnd <= value.dayStart) return false;
  if (!isValidStartOfWeek(value.startOfWeek)) return false;
  return true;
}

function isValidExportData(value: unknown): value is ExportData {
  if (!isRecord(value)) return false;
  if (value.version !== CURRENT_VERSION) return false;
  if (!Array.isArray(value.events) || !value.events.every(isValidRoutineEvent)) return false;
  if (!Array.isArray(value.categories) || !value.categories.every(isValidCategory)) return false;
  if (!isValidSettings(value.settings)) return false;
  return true;
}

export class ImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImportError';
  }
}

export function importFromJSON(json: string): ExportData {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new ImportError('Invalid JSON format.');
  }

  if (!isValidExportData(parsed)) {
    throw new ImportError('Invalid import data: missing or malformed required fields.');
  }

  return parsed;
}

export function parseImportJSON(json: string):
  | { success: true; data: ExportData }
  | { success: false; error: string }
{
  try {
    const data = importFromJSON(json);
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof ImportError ? e.message : 'Unknown error.' };
  }
}
