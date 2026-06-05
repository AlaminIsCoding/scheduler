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
