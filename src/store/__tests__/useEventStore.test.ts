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

    const result = useEventStore.getState().moveEvent(event.id, 'tue', 600);

    expect(result).toBe(true);
    expect(useEventStore.getState().events[0]).toMatchObject({
      day: 'tue',
      startMinutes: 600,
      endMinutes: 660,
    });
  });

  it('rejects move to overlapping position', () => {
    const event1 = useEventStore.getState().addEvent(eventInput);
    useEventStore.getState().addEvent({
      ...eventInput,
      startMinutes: 660,
      endMinutes: 720,
    });

    // Try to move event1 to 660-720 on mon, which overlaps event2
    const result = useEventStore.getState().moveEvent(event1.id, 'mon', 660);

    expect(result).toBe(false);
    // event1 should remain unchanged
    expect(useEventStore.getState().events[0]).toMatchObject({
      day: 'mon',
      startMinutes: 540,
      endMinutes: 600,
    });
  });

  it('rejects move that goes beyond 24 hours', () => {
    const event = useEventStore.getState().addEvent(eventInput);

    const result = useEventStore.getState().moveEvent(event.id, 'mon', 1420);

    expect(result).toBe(false);
    expect(useEventStore.getState().events[0].startMinutes).toBe(540);
  });

  it('rejects move to negative start minutes', () => {
    const event = useEventStore.getState().addEvent(eventInput);

    const result = useEventStore.getState().moveEvent(event.id, 'mon', -30);

    expect(result).toBe(false);
    expect(useEventStore.getState().events[0].startMinutes).toBe(540);
  });

  it('returns false when moving a non-existent event', () => {
    const result = useEventStore.getState().moveEvent('nonexistent', 'mon', 540);
    expect(result).toBe(false);
  });

  it('resizes an event', () => {
    const event = useEventStore.getState().addEvent(eventInput);

    useEventStore.getState().resizeEvent(event.id, 570, 690);

    expect(useEventStore.getState().events[0]).toMatchObject({
      startMinutes: 570,
      endMinutes: 690,
    });
  });

  it('clamps resize to minimum duration of one resolution slot', () => {
    const event = useEventStore.getState().addEvent(eventInput);

    const result = useEventStore.getState().resizeEvent(event.id, 540, 550);

    expect(result).toBe(true);
    expect(useEventStore.getState().events[0]).toMatchObject({
      startMinutes: 540,
      endMinutes: 570,
    });
  });

  it('rejects resize that would overlap another event', () => {
    const event1 = useEventStore.getState().addEvent(eventInput);
    useEventStore.getState().addEvent({
      ...eventInput,
      startMinutes: 660,
      endMinutes: 720,
    });

    const result = useEventStore.getState().resizeEvent(event1.id, 540, 690);

    expect(result).toBe(false);
    expect(useEventStore.getState().events[0]).toMatchObject({
      startMinutes: 540,
      endMinutes: 600,
    });
  });

  it('returns false when resizing a non-existent event', () => {
    const result = useEventStore.getState().resizeEvent('nonexistent', 540, 600);
    expect(result).toBe(false);
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
