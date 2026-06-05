export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface RoutineEvent {
  id: string;
  title: string;
  day: DayOfWeek;
  startMinutes: number;
  endMinutes: number;
  categoryId: string;
  color: string;
}

export interface Settings {
  timeResolution: 15 | 30 | 60;
  dayStart: number;
  dayEnd: number;
  startOfWeek: 'mon' | 'sun';
}
