import { DayColumn } from '../components/calendar/DayColumn';
import { TimeColumn } from '../components/calendar/TimeColumn';
import { DAY_LABELS } from '../lib/constants';
import { getCurrentDayOfWeek } from '../lib/time';

export function TodayPage() {
  const today = getCurrentDayOfWeek();
  const formattedDate = new Intl.DateTimeFormat(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-indigo-600">Today</p>
        <h1 className="text-3xl font-bold text-slate-900">{DAY_LABELS[today]}</h1>
        <p className="mt-1 text-sm text-slate-500">{formattedDate}</p>
      </header>

      <div className="overflow-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex min-w-[520px]">
          <TimeColumn />
          <DayColumn day={today} />
        </div>
      </div>
    </div>
  );
}
