import { DAYS } from '../../lib/constants';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useEventStore } from '../../store/useEventStore';
import type { DayOfWeek } from '../../types';
import { Card } from '../ui/card';
import { DayColumn } from './DayColumn';
import { TimeColumn } from './TimeColumn';

function getOrderedDays(startOfWeek: 'mon' | 'sun'): DayOfWeek[] {
  if (startOfWeek === 'sun') {
    return ['sun', ...DAYS.filter((day) => day !== 'sun')];
  }

  return DAYS;
}

export function CalendarGrid() {
  const startOfWeek = useSettingsStore((state) => state.settings.startOfWeek);
  const events = useEventStore((state) => state.events);
  const orderedDays = getOrderedDays(startOfWeek);

  return (
    <Card className="overflow-hidden rounded-2xl border-border bg-background shadow-sm">
      <div className="overflow-auto">
        <div className="flex min-w-[960px]">
          <TimeColumn />
          {orderedDays.map((day) => (
            <DayColumn key={day} day={day} events={events.filter((event) => event.day === day)} />
          ))}
        </div>
      </div>
    </Card>
  );
}
