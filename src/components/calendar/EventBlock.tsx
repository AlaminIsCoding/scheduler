import { useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
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

  const wasDragging = useRef(false);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `event:${event.id}`,
    data: { event },
  });

  // Track drag state so we can suppress click after a drag
  if (isDragging) {
    wasDragging.current = true;
  }

  const handleClick = () => {
    // If we just finished dragging, suppress the click that fires on pointer-up
    if (wasDragging.current) {
      wasDragging.current = false;
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      ref={setNodeRef}
      type="button"
      aria-label={`${event.title}, ${timeRange}`}
      className={cn(
        "absolute left-1 right-1 overflow-hidden rounded-md border border-white/50 px-2 py-1 text-left text-xs font-medium text-white shadow-sm transition-shadow",
        isDragging && "invisible",
        !isDragging && "cursor-grab"
      )}
      style={{
        top: `${top}%`,
        height: `${height}%`,
        backgroundColor: event.color,
      }}
      onClick={handleClick}
      {...listeners}
      {...attributes}
    >
      <div className="truncate">{event.title}</div>
      <div className="truncate text-white/85">
        {timeRange} · {duration} min
      </div>
    </button>
  );
}
