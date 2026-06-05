import { useEventStore } from '@/store/useEventStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { DAYS, DAY_LABELS } from '@/lib/constants';
import { getDurationMinutes, minutesToTimeString } from '@/lib/time';
import { cn } from '@/lib/utils';
import type { DayOfWeek, RoutineEvent } from '@/types';

function getOrderedDays(startOfWeek: 'mon' | 'sun'): DayOfWeek[] {
  if (startOfWeek === 'sun') return ['sun', ...DAYS.filter((d) => d !== 'sun')];
  return DAYS;
}

function sortEventsByTime(events: RoutineEvent[]): RoutineEvent[] {
  return [...events].sort((a, b) => a.startMinutes - b.startMinutes);
}

interface PrintTableViewProps {
  className?: string;
}

export function PrintTableView({ className }: PrintTableViewProps) {
  const settings = useSettingsStore((s) => s.settings);
  const events = useEventStore((s) => s.events);
  const categories = useCategoryStore((s) => s.categories);
  const orderedDays = getOrderedDays(settings.startOfWeek);

  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  return (
    <div className={cn("space-y-6 p-4", className)}>
      {orderedDays.map((day) => {
        const dayEvents = sortEventsByTime(events.filter((e) => e.day === day));
        if (dayEvents.length === 0) return null;

        return (
          <div key={day}>
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              {DAY_LABELS[day]}
            </h3>
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="border-b border-border/40 bg-muted/20">
                  <th className="w-[22%] px-3 py-1.5 text-left text-xs font-medium text-muted-foreground align-top">Time</th>
                  <th className="w-[44%] px-3 py-1.5 text-left text-xs font-medium text-muted-foreground align-top">Event</th>
                  <th className="w-[22%] px-3 py-1.5 text-left text-xs font-medium text-muted-foreground align-top">Category</th>
                  <th className="w-[12%] px-3 py-1.5 text-right text-xs font-medium text-muted-foreground align-top">Duration</th>
                </tr>
              </thead>
              <tbody>
                {dayEvents.map((event) => {
                  const category = categoryMap.get(event.categoryId);

                  return (
                    <tr key={event.id} className="border-b border-border/20">
                      <td className="px-3 py-1.5 text-xs tabular-nums text-muted-foreground align-top whitespace-nowrap">
                        {minutesToTimeString(event.startMinutes)} &ndash; {minutesToTimeString(event.endMinutes)}
                      </td>
                      <td className="px-3 py-1.5 text-xs font-medium text-foreground break-words align-top">
                        <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: event.color }} />
                        {event.title}
                      </td>
                      <td className="px-3 py-1.5 text-xs text-muted-foreground align-top whitespace-nowrap">
                        <span
                          className="inline-block h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: category?.color ?? event.color }}
                        />
                        <span className="ml-1">{category?.name ?? 'Uncategorized'}</span>
                      </td>
                      <td className="px-3 py-1.5 text-xs tabular-nums text-right text-muted-foreground align-top whitespace-nowrap">
                        {getDurationMinutes(event.startMinutes, event.endMinutes)} min
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
      {events.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">No events scheduled.</p>
      )}
    </div>
  );
}
