import { useEventStore } from '@/store/useEventStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { DAYS, DAY_LABELS } from '@/lib/constants';
import { minutesToTimeString, minutesToPosition } from '@/lib/time';
import { cn } from '@/lib/utils';
import type { DayOfWeek } from '@/types';

function getOrderedDays(startOfWeek: 'mon' | 'sun'): DayOfWeek[] {
  if (startOfWeek === 'sun') return ['sun', ...DAYS.filter((d) => d !== 'sun')];
  return DAYS;
}

interface PrintCalendarViewProps {
  className?: string;
}

export function PrintCalendarView({ className }: PrintCalendarViewProps) {
  const settings = useSettingsStore((s) => s.settings);
  const events = useEventStore((s) => s.events);
  const orderedDays = getOrderedDays(settings.startOfWeek);
  const totalMinutes = settings.dayEnd - settings.dayStart;

  const timeLabels = Array.from(
    { length: Math.ceil(totalMinutes / settings.timeResolution) },
    (_, i) => settings.dayStart + i * settings.timeResolution,
  );

  return (
    <div className={cn("h-full min-h-[800px] flex flex-col", className)}>
      <div className="flex flex-1 min-h-0">
        <div className="w-14 shrink-0 flex flex-col">
          <div className="h-8 shrink-0 border-b border-border/30" />
          <div className="relative flex-1">
            {timeLabels.map((minutes) => (
              <div
                key={minutes}
                className="absolute left-0 right-0 flex items-start justify-end pr-1.5 pt-[3px] text-[11px] font-medium tabular-nums text-muted-foreground"
                style={{ top: `${((minutes - settings.dayStart) / totalMinutes) * 100}%` }}
              >
                {minutesToTimeString(minutes)}
              </div>
            ))}
          </div>
        </div>
        {orderedDays.map((day) => {
          const dayEvents = events
            .filter((e) => e.day === day)
            .sort((a, b) => a.startMinutes - b.startMinutes);

          return (
            <div key={day} className="flex-1 border-l border-border/30 flex flex-col">
              <div className="h-8 shrink-0 flex items-center justify-center border-b border-border/30 bg-muted/20 text-xs font-semibold text-muted-foreground">
                {DAY_LABELS[day]}
              </div>
              <div className="relative flex-1">
                {timeLabels.map((minutes) => (
                  <div
                    key={minutes}
                    className="absolute left-0 right-0 border-t border-border/20"
                    style={{ top: `${((minutes - settings.dayStart) / totalMinutes) * 100}%` }}
                  />
                ))}
                {dayEvents.map((event) => {
                  const top = minutesToPosition(event.startMinutes, settings.dayStart, settings.dayEnd);
                  const height = minutesToPosition(event.endMinutes, settings.dayStart, settings.dayEnd) - top;

                  return (
                    <div
                      key={event.id}
                      className="absolute left-0.5 right-0.5 overflow-hidden rounded border-l-[3px] px-1 py-0.5 text-xs leading-snug text-white"
                      style={{
                        top: `${top}%`,
                        height: `${height}%`,
                        backgroundColor: event.color,
                        borderLeftColor: event.color,
                      }}
                    >
                      <div className="break-words font-medium leading-snug">{event.title}</div>
                      <div className="break-words text-white/80 leading-snug">
                        {minutesToTimeString(event.startMinutes)} &ndash; {minutesToTimeString(event.endMinutes)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
