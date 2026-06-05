import { CalendarGrid } from '../components/calendar/CalendarGrid';

export function WeeklyPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Weekly Routine</h1>
        <p className="mt-1 text-sm text-slate-500">Plan your full week at a glance.</p>
      </header>

      <CalendarGrid />
    </div>
  );
}
