import type { DayOfWeek } from '../types';

const JAVASCRIPT_DAY_TO_DAY_OF_WEEK: Record<number, DayOfWeek> = {
  0: 'sun',
  1: 'mon',
  2: 'tue',
  3: 'wed',
  4: 'thu',
  5: 'fri',
  6: 'sat',
};

export function getCurrentDayOfWeek(): DayOfWeek {
  return JAVASCRIPT_DAY_TO_DAY_OF_WEEK[new Date().getDay()];
}

export function minutesToTimeString(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}
