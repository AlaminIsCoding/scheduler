import { useRef, useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { useResizeEvent } from '../../hooks/useResizeEvent';
import { getDurationMinutes, minutesToPosition, minutesToTimeString } from '../../lib/time';
import { useEventStore } from '../../store/useEventStore';
import type { RoutineEvent } from '../../types';

export const dragDuplicateRef = { current: null as string | null };

interface EventBlockProps {
  event: RoutineEvent;
  dayStart: number;
  dayEnd: number;
  onClick?: (event: RoutineEvent) => void;
}

export function EventBlock({ event, dayStart, dayEnd, onClick }: EventBlockProps) {
  const { onPointerDown: onResizePointerDown, isResizing, previewEndMinutes } = useResizeEvent(event);

  const displayEnd = previewEndMinutes ?? event.endMinutes;
  const top = minutesToPosition(event.startMinutes, dayStart, dayEnd);
  const height = minutesToPosition(displayEnd, dayStart, dayEnd) - top;
  const timeRange = `${minutesToTimeString(event.startMinutes)}-${minutesToTimeString(displayEnd)}`;
  const duration = getDurationMinutes(event.startMinutes, displayEnd);

  const wasDragging = useRef(false);
  const wasResizing = useRef(false);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `event:${event.id}`,
    data: { event },
  });

  const enhancedListeners = useMemo(() => {
    if (!listeners) return {};
    const { onPointerDown, ...rest } = listeners as Record<string, Function>;
    return {
      ...rest,
      onPointerDown: (e: React.PointerEvent) => {
        if (e.shiftKey) {
          const clone = useEventStore.getState().duplicateEvent(event.id);
          dragDuplicateRef.current = clone.id;
        }
        onPointerDown?.(e);
      },
    };
  }, [listeners, event.id]);

  if (isResizing) {
    wasResizing.current = true;
  }

  if (isDragging) {
    wasDragging.current = true;
  }

  const handleClick = () => {
    if (wasResizing.current) {
      wasResizing.current = false;
      return;
    }
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
        !isDragging && !isResizing && "cursor-grab"
      )}
      style={{
        top: `${top}%`,
        height: `${height}%`,
        backgroundColor: event.color,
      }}
      onClick={handleClick}
      {...enhancedListeners}
      {...attributes}
    >
      <div className="truncate">{event.title}</div>
      <div className="truncate text-white/85">
        {timeRange} · {duration} min
      </div>
      <div
        onPointerDown={onResizePointerDown}
        className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize touch-none rounded-b-md bg-white/20 hover:bg-white/40"
      />
    </button>
  );
}
