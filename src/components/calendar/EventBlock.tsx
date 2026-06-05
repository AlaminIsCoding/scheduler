import { getDurationMinutes, minutesToPosition, minutesToTimeString } from '../../lib/time';
import type { RoutineEvent } from '../../types';

interface EventBlockProps {
  event: RoutineEvent;
  dayStart: number;
  dayEnd: number;
  onClick?: (event: RoutineEvent) => void;
}

export function EventBlock({ event, dayStart, dayEnd, onClick }: EventBlockProps) {
  const top = minutesToPosition(event.startMinutes, dayStart, dayEnd);
  const height = minutesToPosition(event.endMinutes, dayStart, dayEnd) - top;
  const timeRange = `${minutesToTimeString(event.startMinutes)}-${minutesToTimeString(event.endMinutes)}`;
  const duration = getDurationMinutes(event.startMinutes, event.endMinutes);

  return (
    <button
      type="button"
      aria-label={`${event.title}, ${timeRange}`}
      className="absolute left-1 right-1 overflow-hidden rounded-md border border-white/50 px-2 py-1 text-left text-xs font-medium text-white shadow-sm"
      style={{

        top: `${top}%`,
        height: `${height}%`,
        backgroundColor: event.color,
      }}
      onClick={() => onClick?.(event)}
    >
      <div className="truncate">{event.title}</div>
      <div className="truncate text-white/85">
        {timeRange} · {duration} min
      </div>
    </button>
  );
}
