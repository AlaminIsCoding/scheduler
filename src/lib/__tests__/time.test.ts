import { describe, expect, it } from 'vitest';
import type { RoutineEvent } from '../../types';
import {
  eventsOverlap,
  generateTimeSelectOptions,
  generateTimeSlots,
  getDurationMinutes,
  hasOverlappingEvent,
  isWithinDayBounds,
  minutesToPosition,
  minutesToTimeString,
  parseSlotId,
  snapToGrid,
} from '../time';

const createEvent = (event: Partial<RoutineEvent>): RoutineEvent => ({
  id: 'event-1',
  title: 'Event',
  day: 'mon',
  startMinutes: 540,
  endMinutes: 600,
  categoryId: 'study',
  color: '#6366f1',
  ...event,
});

describe('time utilities', () => {
  it('formats minutes as a time string', () => {
    expect(minutesToTimeString(0)).toBe('00:00');
    expect(minutesToTimeString(545)).toBe('09:05');
    expect(minutesToTimeString(1380)).toBe('23:00');
  });

  it('generates time slots between the day start and day end', () => {
    expect(generateTimeSlots(540, 660, 30)).toEqual([540, 570, 600, 630]);
  });

  it('converts minutes to a percentage position within the day range', () => {
    expect(minutesToPosition(540, 540, 660)).toBe(0);
    expect(minutesToPosition(600, 540, 660)).toBe(50);
    expect(minutesToPosition(660, 540, 660)).toBe(100);
  });

  it('returns zero position for an invalid day range', () => {
    expect(minutesToPosition(600, 660, 660)).toBe(0);
  });

  it('calculates duration in minutes', () => {
    expect(getDurationMinutes(540, 615)).toBe(75);
  });

  it('generates time select options including the day end', () => {
    expect(generateTimeSelectOptions(540, 600, 30)).toEqual([
      { value: 540, label: '09:00' },
      { value: 570, label: '09:30' },
      { value: 600, label: '10:00' },
    ]);
  });

  it('detects overlapping events on the same day', () => {
    expect(
      eventsOverlap(
        createEvent({ id: 'event-1', startMinutes: 540, endMinutes: 600 }),
        createEvent({ id: 'event-2', startMinutes: 570, endMinutes: 630 }),
      ),
    ).toBe(true);
  });

  it('does not treat adjacent events as overlapping', () => {
    expect(
      eventsOverlap(
        createEvent({ id: 'event-1', startMinutes: 540, endMinutes: 600 }),
        createEvent({ id: 'event-2', startMinutes: 600, endMinutes: 630 }),
      ),
    ).toBe(false);
  });

  it('does not treat events on different days as overlapping', () => {
    expect(
      eventsOverlap(
        createEvent({ id: 'event-1', day: 'mon', startMinutes: 540, endMinutes: 600 }),
        createEvent({ id: 'event-2', day: 'tue', startMinutes: 570, endMinutes: 630 }),
      ),
    ).toBe(false);
  });

  it('detects whether an event overlaps another event in a list', () => {
    const event = createEvent({ id: 'event-1', startMinutes: 540, endMinutes: 600 });
    const events = [
      event,
      createEvent({ id: 'event-2', startMinutes: 600, endMinutes: 630 }),
      createEvent({ id: 'event-3', startMinutes: 590, endMinutes: 660 }),
    ];

    expect(hasOverlappingEvent(event, events)).toBe(true);
  });
});

describe('snapToGrid', () => {
  it('snaps to the nearest grid boundary', () => {
    expect(snapToGrid(545, 30)).toBe(540);
    expect(snapToGrid(555, 30)).toBe(540 + 30);
    expect(snapToGrid(540, 30)).toBe(540);
  });

  it('snaps with 15-minute resolution', () => {
    expect(snapToGrid(542, 15)).toBe(540);
    expect(snapToGrid(548, 15)).toBe(555);
    expect(snapToGrid(555, 15)).toBe(555);
  });

  it('snaps with 60-minute resolution', () => {
    expect(snapToGrid(500, 60)).toBe(480);
    expect(snapToGrid(540, 60)).toBe(540);
  });
});

describe('isWithinDayBounds', () => {
  it('returns true when start and end are within bounds', () => {
    expect(isWithinDayBounds(540, 600, 360, 1380)).toBe(true);
  });

  it('returns false when start is before day start', () => {
    expect(isWithinDayBounds(300, 400, 360, 1380)).toBe(false);
  });

  it('returns false when end exceeds day end', () => {
    expect(isWithinDayBounds(1350, 1410, 360, 1380)).toBe(false);
  });

  it('returns true when exactly at boundaries', () => {
    expect(isWithinDayBounds(360, 1380, 360, 1380)).toBe(true);
  });
});

describe('parseSlotId', () => {
  it('parses a valid slot ID', () => {
    expect(parseSlotId('slot:mon:540')).toEqual({ day: 'mon', startMinutes: 540 });
    expect(parseSlotId('slot:fri:0')).toEqual({ day: 'fri', startMinutes: 0 });
  });

  it('returns null for invalid format', () => {
    expect(parseSlotId('invalid')).toBeNull();
    expect(parseSlotId('slot:mon')).toBeNull();
    expect(parseSlotId('event:mon:540')).toBeNull();
  });

  it('returns null for invalid day', () => {
    expect(parseSlotId('slot:xyz:540')).toBeNull();
  });

  it('returns null for non-numeric minutes', () => {
    expect(parseSlotId('slot:mon:abc')).toBeNull();
  });
});
