import { CalendarGrid } from '../components/calendar/CalendarGrid';
import { Toolbar } from '../components/toolbar/Toolbar';

export function WeeklyPage() {
  return (
    <div className="space-y-6 overflow-hidden">
      <header className="flex flex-col gap-4 rounded-2xl border border-border bg-background/95 p-5 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Weekly Routine</h1>
            <p className="mt-1 text-sm text-muted-foreground">Plan your full week at a glance.</p>
          </div>
        </div>
        <Toolbar />
      </header>

      <CalendarGrid />
    </div>
  );
}
