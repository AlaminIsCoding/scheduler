import { beforeEach, describe, expect, it } from 'vitest';
import { useEventStore } from '../useEventStore';

const eventInput = {
  title: 'Focus block',
  day: 'mon' as const,
  startMinutes: 540,
  endMinutes: 600,
  categoryId: 'study',
  color: '#6366f1',
};

describe('useEventStore', () => {
  beforeEach(() => {
    useEventStore.setState({ events: [] });
  });

  it('starts with no events', () => {
    expect(useEventStore.getState().events).toEqual([]);
  });

  it('adds an event', () => {
    const event = useEventStore.getState().addEvent(eventInput);

    expect(event).toMatchObject(eventInput);
    expect(event.id).toEqual(expect.any(String));
    expect(useEventStore.getState().events).toEqual([event]);
  });

  it('updates an event', () => {
    const event = useEventStore.getState().addEvent(eventInput);

    useEventStore.getState().updateEvent(event.id, { title: 'Updated block', color: '#22c55e' });

    expect(useEventStore.getState().events[0]).toEqual({
      ...event,
      title: 'Updated block',
      color: '#22c55e',
    });
  });

  it('deletes an event', () => {
    const event = useEventStore.getState().addEvent(eventInput);

    useEventStore.getState().deleteEvent(event.id);

    expect(useEventStore.getState().events).toEqual([]);
  });

  it('moves an event while preserving duration', () => {
    const event = useEventStore.getState().addEvent(eventInput);

    useEventStore.getState().moveEvent(event.id, 'tue', 600);

    expect(useEventStore.getState().events[0]).toMatchObject({
      day: 'tue',
      startMinutes: 600,
      endMinutes: 660,
    });
  });

  it('resizes an event', () => {
    const event = useEventStore.getState().addEvent(eventInput);

    useEventStore.getState().resizeEvent(event.id, 570, 690);

    expect(useEventStore.getState().events[0]).toMatchObject({
      startMinutes: 570,
      endMinutes: 690,
    });
  });

  it('rejects invalid event times', () => {
    expect(() =>
      useEventStore.getState().addEvent({
        ...eventInput,
        startMinutes: 600,
        endMinutes: 600,
      }),
    ).toThrow('Event end time must be after start time.');

    const event = useEventStore.getState().addEvent(eventInput);

    expect(() => useEventStore.getState().updateEvent(event.id, { endMinutes: 500 })).toThrow(
      'Event end time must be after start time.',
    );
    expect(() => useEventStore.getState().resizeEvent(event.id, 700, 650)).toThrow(
      'Event end time must be after start time.',
    );
  });
});
