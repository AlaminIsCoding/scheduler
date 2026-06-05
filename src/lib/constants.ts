import type { Category, DayOfWeek, Settings } from '../types';

export const DAYS: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

export const COLOR_PALETTE = [
  '#6366f1',
  '#22c55e',
  '#f97316',
  '#ef4444',
  '#06b6d4',
  '#a855f7',
  '#eab308',
  '#14b8a6',
] as const;

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'study', name: 'Study', color: COLOR_PALETTE[0] },
  { id: 'work', name: 'Work', color: COLOR_PALETTE[1] },
  { id: 'health', name: 'Health', color: COLOR_PALETTE[2] },
  { id: 'personal', name: 'Personal', color: COLOR_PALETTE[3] },
];

export const DEFAULT_SETTINGS: Settings = {
  timeResolution: 30,
  dayStart: 360,
  dayEnd: 1380,
  startOfWeek: 'mon',
};
