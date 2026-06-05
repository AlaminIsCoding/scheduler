import { CalendarGrid } from '../components/calendar/CalendarGrid';
import { Toolbar } from '../components/toolbar/Toolbar';

export function WeeklyPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-2xl border border-border bg-background/95 p-5 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Weekly planner</p>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Weekly Routine</h1>
            <p className="mt-1 text-sm text-muted-foreground">Plan your full week at a glance.</p>
          </div>
        </div>
        <Toolbar />
      </header>

      <CalendarGrid />
    </div>
  );
}
