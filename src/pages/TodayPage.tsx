import { DayColumn } from '../components/calendar/DayColumn';
import { TimeColumn } from '../components/calendar/TimeColumn';
import { DAY_LABELS } from '../lib/constants';
import { getCurrentDayOfWeek } from '../lib/time';
import { useEventStore } from '../store/useEventStore';

export function TodayPage() {
  const today = getCurrentDayOfWeek();
  const events = useEventStore((state) => state.events);
  const todayEvents = events.filter((event) => event.day === today);
  const formattedDate = new Intl.DateTimeFormat(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-2xl border border-border bg-background/95 p-5 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Today</p>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{DAY_LABELS[today]}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Focus your routine for {formattedDate}.</p>
          </div>
        </div>
        <div className="rounded-full border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground">
          Toolbar coming soon
        </div>
      </header>

      <div className="overflow-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex min-w-[520px]">
          <TimeColumn />
          <DayColumn day={today} events={todayEvents} />
        </div>
      </div>
    </div>
  );
}
