import { useState, useCallback } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { DayColumn } from '../components/calendar/DayColumn';
import { DragOverlayEvent } from '../components/calendar/DragOverlayEvent';
import { dragDuplicateRef } from '../components/calendar/EventBlock';
import { TimeColumn } from '../components/calendar/TimeColumn';
import { Toolbar } from '../components/toolbar/Toolbar';
import { DAY_LABELS } from '../lib/constants';
import { getCurrentDayOfWeek, parseSlotId } from '../lib/time';
import { useEventStore } from '../store/useEventStore';
import type { RoutineEvent } from '../types';

export function TodayPage() {
  const today = getCurrentDayOfWeek();
  const events = useEventStore((state) => state.events);
  const moveEvent = useEventStore((state) => state.moveEvent);
  const todayEvents = events.filter((event) => event.day === today);
  const formattedDate = new Intl.DateTimeFormat(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());
  const [activeEvent, setActiveEvent] = useState<RoutineEvent | null>(null);

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const sorted = [...todayEvents].sort((a, b) => a.startMinutes - b.startMinutes);
  const currentEvent = sorted.find(
    (e) => e.startMinutes <= currentMinutes && e.endMinutes > currentMinutes,
  );
  const nextEvent = !currentEvent
    ? sorted.find((e) => e.startMinutes > currentMinutes)
    : null;
  const suggestion = currentEvent
    ? `Now: ${currentEvent.title}`
    : nextEvent
      ? `Up next: ${nextEvent.title}`
      : 'No events scheduled today.';

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const draggedEvent = event.active.data.current?.event as RoutineEvent | undefined;
    setActiveEvent(draggedEvent ?? null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveEvent(null);

      const { active, over } = event;
      if (!over) return;

      const droppableId = String(over.id);
      const parsed = parseSlotId(droppableId);
      if (!parsed) return;

      const draggedEvent = active.data.current?.event as RoutineEvent | undefined;
      if (!draggedEvent) return;

      const eventId = dragDuplicateRef.current ?? draggedEvent.id;
      moveEvent(eventId, parsed.day, parsed.startMinutes);
      dragDuplicateRef.current = null;
    },
    [moveEvent],
  );

  const handleDragCancel = useCallback(() => {
    setActiveEvent(null);
    dragDuplicateRef.current = null;
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-2xl border border-border bg-background/95 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{DAY_LABELS[today]}</h1>
            <span className="text-sm text-muted-foreground">{formattedDate}</span>
          </div>
          <p className="text-sm text-muted-foreground">{suggestion}</p>
        </div>
        <Toolbar />
      </header>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="overflow-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex min-w-[520px]">
            <TimeColumn />
            <DayColumn day={today} events={todayEvents} compact />
          </div>
        </div>
        <DragOverlay dropAnimation={null}>
          {activeEvent ? <DragOverlayEvent event={activeEvent} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
