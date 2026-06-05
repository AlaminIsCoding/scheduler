import { DAYS } from '../../lib/constants';
import { useSettingsStore } from '../../store/useSettingsStore';
import type { DayOfWeek } from '../../types';
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
  const orderedDays = getOrderedDays(startOfWeek);

  return (
    <div className="overflow-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex min-w-[960px]">
        <TimeColumn />
        {orderedDays.map((day) => (
          <DayColumn key={day} day={day} />
        ))}
      </div>
    </div>
  );
}
