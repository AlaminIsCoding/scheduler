import { useState, useCallback } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { DAYS } from '../../lib/constants';
import { parseSlotId } from '../../lib/time';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useEventStore } from '../../store/useEventStore';
import type { DayOfWeek, RoutineEvent } from '../../types';
import { Card } from '../ui/card';
import { DayColumn } from './DayColumn';
import { DragOverlayEvent } from './DragOverlayEvent';
import { dragDuplicateRef } from './EventBlock';
import { TimeColumn } from './TimeColumn';

function getOrderedDays(startOfWeek: 'mon' | 'sun'): DayOfWeek[] {
  if (startOfWeek === 'sun') {
    return ['sun', ...DAYS.filter((day) => day !== 'sun')];
  }

  return DAYS;
}

export function CalendarGrid() {
  const startOfWeek = useSettingsStore((state) => state.settings.startOfWeek);
  const events = useEventStore((state) => state.events);
  const moveEvent = useEventStore((state) => state.moveEvent);
  const orderedDays = getOrderedDays(startOfWeek);
  const [activeEvent, setActiveEvent] = useState<RoutineEvent | null>(null);

  // Require 5px movement before starting drag to preserve click-to-edit
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
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <Card className="overflow-hidden rounded-2xl border-border bg-background shadow-sm">
        <div className="overflow-auto">
          <div className="flex min-w-[960px]">
            <TimeColumn />
            {orderedDays.map((day) => (
              <DayColumn key={day} day={day} events={events.filter((event) => event.day === day)} />
            ))}
          </div>
        </div>
      </Card>
      <DragOverlay dropAnimation={null}>
        {activeEvent ? <DragOverlayEvent event={activeEvent} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
