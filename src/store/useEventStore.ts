import { nanoid } from 'nanoid';
import { create } from 'zustand';
import type { DayOfWeek, RoutineEvent } from '../types';

type EventInput = Omit<RoutineEvent, 'id'>;
type EventUpdate = Partial<Omit<RoutineEvent, 'id'>>;

interface EventStore {
  events: RoutineEvent[];
  addEvent: (event: EventInput) => RoutineEvent;
  updateEvent: (id: string, event: EventUpdate) => void;
  deleteEvent: (id: string) => void;
  moveEvent: (id: string, day: DayOfWeek, startMinutes: number) => void;
  resizeEvent: (id: string, startMinutes: number, endMinutes: number) => void;
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
      return;
    }

    const duration = currentEvent.endMinutes - currentEvent.startMinutes;
    const endMinutes = startMinutes + duration;
    assertValidEventTime(startMinutes, endMinutes);

    set((state) => ({
      events: state.events.map((event) =>
        event.id === id ? { ...event, day, startMinutes, endMinutes } : event,
      ),
    }));
  },
  resizeEvent: (id, startMinutes, endMinutes) => {
    assertValidEventTime(startMinutes, endMinutes);

    set((state) => ({
      events: state.events.map((event) =>
        event.id === id ? { ...event, startMinutes, endMinutes } : event,
      ),
    }));
  },
}));
