import { useCallback, useEffect, useRef, useState } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useEventStore } from '../store/useEventStore';
import { snapToGrid } from '../lib/time';
import type { RoutineEvent } from '../types';

export interface UseResizeEventReturn {
  onPointerDown: (e: React.PointerEvent) => void;
  isResizing: boolean;
  previewEndMinutes: number | null;
}

export function useResizeEvent(event: RoutineEvent): UseResizeEventReturn {
  const [isResizing, setIsResizing] = useState(false);
  const [previewEndMinutes, setPreviewEndMinutes] = useState<number | null>(null);

  const { timeResolution, dayStart, dayEnd } = useSettingsStore((s) => s.settings);
  const resizeEvent = useEventStore((s) => s.resizeEvent);

  const eventRef = useRef(event);
  eventRef.current = event;

  const moveHandlerRef = useRef<((e: PointerEvent) => void) | null>(null);
  const upHandlerRef = useRef<((e: PointerEvent) => void) | null>(null);

  useEffect(() => {
    return () => {
      if (moveHandlerRef.current) {
        window.removeEventListener('pointermove', moveHandlerRef.current);
      }
      if (upHandlerRef.current) {
        window.removeEventListener('pointerup', upHandlerRef.current);
      }
    };
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();

    const column = (e.currentTarget as HTMLElement).closest('[data-column]') as HTMLElement | null;
    if (!column) return;

    const columnHeight = column.getBoundingClientRect().height;
    if (columnHeight <= 0) return;

    const initialY = e.clientY;
    const initialEnd = eventRef.current.endMinutes;
    const totalMinutes = dayEnd - dayStart;

    setIsResizing(true);
    setPreviewEndMinutes(initialEnd);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaY = moveEvent.clientY - initialY;
      const deltaMinutes = (deltaY / columnHeight) * totalMinutes;
      const newEnd = initialEnd + deltaMinutes;
      const snappedEnd = snapToGrid(newEnd, timeResolution);
      setPreviewEndMinutes(snappedEnd);
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      const deltaY = upEvent.clientY - initialY;
      const deltaMinutes = (deltaY / columnHeight) * totalMinutes;
      const newEnd = initialEnd + deltaMinutes;
      const snappedEnd = snapToGrid(newEnd, timeResolution);

      resizeEvent(eventRef.current.id, eventRef.current.startMinutes, snappedEnd);

      setIsResizing(false);
      setPreviewEndMinutes(null);

      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      moveHandlerRef.current = null;
      upHandlerRef.current = null;
    };

    moveHandlerRef.current = handlePointerMove;
    upHandlerRef.current = handlePointerUp;
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  }, [dayStart, dayEnd, timeResolution, resizeEvent]);

  return { onPointerDown, isResizing, previewEndMinutes };
}
