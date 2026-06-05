import { getDurationMinutes, minutesToTimeString } from '../../lib/time';
import type { RoutineEvent } from '../../types';

interface DragOverlayEventProps {
  event: RoutineEvent;
}

export function DragOverlayEvent({ event }: DragOverlayEventProps) {
  const timeRange = `${minutesToTimeString(event.startMinutes)}-${minutesToTimeString(event.endMinutes)}`;
  const duration = getDurationMinutes(event.startMinutes, event.endMinutes);

  return (
    <div
      className="w-40 overflow-hidden rounded-md border border-white/50 px-2 py-1 text-left text-xs font-medium text-white shadow-lg opacity-90"
      style={{ backgroundColor: event.color }}
    >
      <div className="truncate">{event.title}</div>
      <div className="truncate text-white/85">
        {timeRange} · {duration} min
      </div>
    </div>
  );
}
