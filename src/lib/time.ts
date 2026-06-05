import type { DayOfWeek, RoutineEvent } from '../types';

const JAVASCRIPT_DAY_TO_DAY_OF_WEEK: Record<number, DayOfWeek> = {
  0: 'sun',
  1: 'mon',
  2: 'tue',
  3: 'wed',
  4: 'thu',
  5: 'fri',
  6: 'sat',
};

export interface TimeSelectOption {
  value: number;
  label: string;
}

export function getCurrentDayOfWeek(): DayOfWeek {
  return JAVASCRIPT_DAY_TO_DAY_OF_WEEK[new Date().getDay()];
}

export function minutesToTimeString(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export function generateTimeSlots(
  dayStart: number,
  dayEnd: number,
  timeResolution: number,
): number[] {
  const slots: number[] = [];

  for (let minutes = dayStart; minutes < dayEnd; minutes += timeResolution) {
    slots.push(minutes);
  }

  return slots;
}

export function minutesToPosition(minutes: number, dayStart: number, dayEnd: number): number {
  const dayDuration = dayEnd - dayStart;

  if (dayDuration <= 0) {
    return 0;
  }

  return ((minutes - dayStart) / dayDuration) * 100;
}

export function getDurationMinutes(startMinutes: number, endMinutes: number): number {
  return endMinutes - startMinutes;
}

export function generateTimeSelectOptions(
  dayStart: number,
  dayEnd: number,
  timeResolution: number,
): TimeSelectOption[] {
  return generateTimeSlots(dayStart, dayEnd + timeResolution, timeResolution).map((minutes) => ({
    value: minutes,
    label: minutesToTimeString(minutes),
  }));
}

export function eventsOverlap(first: RoutineEvent, second: RoutineEvent): boolean {
  if (first.day !== second.day) {
    return false;
  }

  return first.startMinutes < second.endMinutes && second.startMinutes < first.endMinutes;
}

export function hasOverlappingEvent(event: RoutineEvent, events: RoutineEvent[]): boolean {
  return events.some((item) => item.id !== event.id && eventsOverlap(event, item));
}

/**
 * Snap a minute value down to the nearest grid resolution boundary.
 */
export function snapToGrid(minutes: number, resolution: number): number {
  return Math.round(minutes / resolution) * resolution;
}

/**
 * Check whether a proposed start/end range fits within the day boundaries.
 */
export function isWithinDayBounds(
  startMinutes: number,
  endMinutes: number,
  dayStart: number,
  dayEnd: number,
): boolean {
  return startMinutes >= dayStart && endMinutes <= dayEnd;
}

/**
 * Parse a droppable slot ID like "slot:mon:540" into its day and startMinutes.
 * Returns null if the format is invalid.
 */
export function parseSlotId(
  slotId: string,
): { day: DayOfWeek; startMinutes: number } | null {
  const parts = slotId.split(':');
  if (parts.length !== 3 || parts[0] !== 'slot') {
    return null;
  }

  const day = parts[1] as DayOfWeek;
  const validDays: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  if (!validDays.includes(day)) {
    return null;
  }

  const minutes = Number(parts[2]);
  if (Number.isNaN(minutes)) {
    return null;
  }

  return { day, startMinutes: minutes };
}
