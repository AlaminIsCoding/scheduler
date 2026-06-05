import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS } from '../../../lib/constants';
import { useEventStore } from '../../../store/useEventStore';
import { useSettingsStore } from '../../../store/useSettingsStore';
import { CalendarGrid } from '../CalendarGrid';

describe('CalendarGrid CRUD flow', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    useEventStore.setState({ events: [] });
    useSettingsStore.setState({ settings: DEFAULT_SETTINGS });
  });

  it('opens the create popover and creates an event', () => {
    render(<CalendarGrid />);

    fireEvent.click(screen.getByLabelText('Create event at Monday 540'));

    expect(screen.getByText('Create event')).toBeTruthy();

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Morning study' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByRole('button', { name: 'Morning study, 09:00-09:30' })).toBeTruthy();
    expect(useEventStore.getState().events).toHaveLength(1);
    expect(useEventStore.getState().events[0]).toMatchObject({
      title: 'Morning study',
      day: 'mon',
      startMinutes: 540,
      endMinutes: 570,
    });
  });

  it('opens the edit popover and deletes an event', () => {
    const event = useEventStore.getState().addEvent({
      title: 'Morning study',
      day: 'mon',
      startMinutes: 540,
      endMinutes: 570,
      categoryId: 'study',
      color: '#6366f1',
    });

    render(<CalendarGrid />);

    fireEvent.click(screen.getByRole('button', { name: 'Morning study, 09:00-09:30' }));

    expect(screen.getByText('Edit event')).toBeTruthy();
    expect(within(document.body).getByDisplayValue('Morning study')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(screen.queryByRole('button', { name: 'Morning study, 09:00-09:30' })).toBeNull();
    expect(useEventStore.getState().events.find((item) => item.id === event.id)).toBeUndefined();
  });
});
