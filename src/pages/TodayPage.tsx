import { useState, useCallback } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { DayColumn } from '../components/calendar/DayColumn';
import { DragOverlayEvent } from '../components/calendar/DragOverlayEvent';
import { TimeColumn } from '../components/calendar/TimeColumn';
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

      moveEvent(draggedEvent.id, parsed.day, parsed.startMinutes);
    },
    [moveEvent],
  );

  const handleDragCancel = useCallback(() => {
    setActiveEvent(null);
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-2xl border border-border bg-background/95 p-5 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Today</p>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{DAY_LABELS[today]}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Focus your routine for {formattedDate}.</p>
          </div>
        </div>
        <div className="rounded-full border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground">
          Toolbar coming soon
        </div>
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
            <DayColumn day={today} events={todayEvents} />
          </div>
        </div>
        <DragOverlay dropAnimation={null}>
          {activeEvent ? <DragOverlayEvent event={activeEvent} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
