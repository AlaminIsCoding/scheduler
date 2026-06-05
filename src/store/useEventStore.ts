import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { hasOverlappingEvent } from '../lib/time';
import { useSettingsStore } from './useSettingsStore';
import type { DayOfWeek, RoutineEvent } from '../types';

type EventInput = Omit<RoutineEvent, 'id'>;
type EventUpdate = Partial<Omit<RoutineEvent, 'id'>>;

interface EventStore {
  events: RoutineEvent[];
  addEvent: (event: EventInput) => RoutineEvent;
  updateEvent: (id: string, event: EventUpdate) => void;
  deleteEvent: (id: string) => void;
  moveEvent: (id: string, day: DayOfWeek, startMinutes: number) => boolean;
  resizeEvent: (id: string, startMinutes: number, endMinutes: number) => boolean;
}

const assertValidEventTime = (startMinutes: number, endMinutes: number) => {
  if (endMinutes <= startMinutes) {
    throw new Error('Event end time must be after start time.');
  }
};

export const useEventStore = create<EventStore>((set, get) => ({
  events: [],
  addEvent: (event) => {
    assertValidEventTime(event.startMinutes, event.endMinutes);

    const newEvent: RoutineEvent = {
      ...event,
      id: nanoid(),
    };

    set((state) => ({ events: [...state.events, newEvent] }));

    return newEvent;
  },
  updateEvent: (id, event) => {
    const currentEvent = get().events.find((item) => item.id === id);

    if (!currentEvent) {
      return;
    }

    const nextEvent = { ...currentEvent, ...event };
    assertValidEventTime(nextEvent.startMinutes, nextEvent.endMinutes);

    set((state) => ({
      events: state.events.map((item) => (item.id === id ? nextEvent : item)),
    }));
  },
  deleteEvent: (id) => {
    set((state) => ({ events: state.events.filter((event) => event.id !== id) }));
  },
  moveEvent: (id, day, startMinutes) => {
    const currentEvent = get().events.find((event) => event.id === id);

    if (!currentEvent) {
      return false;
    }

    const duration = currentEvent.endMinutes - currentEvent.startMinutes;
    const endMinutes = startMinutes + duration;
    assertValidEventTime(startMinutes, endMinutes);

    // Check for out-of-range (negative minutes or beyond 24h)
    if (startMinutes < 0 || endMinutes > 1440) {
      return false;
    }

    const candidateEvent: RoutineEvent = {
      ...currentEvent,
      day,
      startMinutes,
      endMinutes,
    };

    if (hasOverlappingEvent(candidateEvent, get().events)) {
      return false;
    }

    set((state) => ({
      events: state.events.map((event) =>
        event.id === id ? candidateEvent : event,
      ),
    }));

    return true;
  },
  resizeEvent: (id, startMinutes, endMinutes) => {
    assertValidEventTime(startMinutes, endMinutes);

    const currentEvent = get().events.find((e) => e.id === id);
    if (!currentEvent) return false;

    const resolution = useSettingsStore.getState().settings.timeResolution;

    const minEnd = startMinutes + resolution;
    const clampedEnd = Math.max(endMinutes, minEnd);

    const candidateEvent: RoutineEvent = {
      ...currentEvent,
      startMinutes,
      endMinutes: clampedEnd,
    };

    if (hasOverlappingEvent(candidateEvent, get().events)) {
      return false;
    }

    set((state) => ({
      events: state.events.map((event) =>
        event.id === id ? candidateEvent : event,
      ),
    }));

    return true;
  },
}));
