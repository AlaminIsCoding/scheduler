import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { DAY_LABELS } from '../../lib/constants';
import { EventPopover } from '../../components/events/EventPopover';
import { generateTimeSlots, getCurrentDayOfWeek } from '../../lib/time';
import { useSettingsStore } from '../../store/useSettingsStore';
import type { DayOfWeek, RoutineEvent } from '../../types';
import { cn } from '@/lib/utils';
import { EventBlock } from './EventBlock';

interface DroppableSlotProps {
  day: DayOfWeek;
  startMinutes: number;
  onClick: () => void;
}

function DroppableSlot({ day, startMinutes, onClick }: DroppableSlotProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot:${day}:${startMinutes}`,
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      aria-label={`Create event at ${DAY_LABELS[day]} ${startMinutes}`}
      className={cn(
        "block h-12 w-full border-b border-border/50 bg-background transition-colors hover:bg-muted/50",
        isOver && "bg-primary/15"
      )}
      onClick={onClick}
    />
  );
}

interface DayColumnProps {
  day: DayOfWeek;
  events: RoutineEvent[];
}

export function DayColumn({ day, events }: DayColumnProps) {
  const settings = useSettingsStore((state) => state.settings);
  const slots = generateTimeSlots(settings.dayStart, settings.dayEnd, settings.timeResolution);
  const isToday = day === getCurrentDayOfWeek();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedStartMinutes, setSelectedStartMinutes] = useState(settings.dayStart);
  const [selectedEvent, setSelectedEvent] = useState<RoutineEvent | null>(null);

  const openCreatePopover = (startMinutes: number) => {
    setSelectedEvent(null);
    setSelectedStartMinutes(startMinutes);
    setIsPopoverOpen(true);
  };

  const openEditPopover = (event: RoutineEvent) => {
    setSelectedEvent(event);
    setSelectedStartMinutes(event.startMinutes);
    setIsPopoverOpen(true);
  };

  return (
    <div className="min-w-40 flex-1 border-r border-border/70 bg-background last:border-r-0" aria-label={DAY_LABELS[day]}>
      <div
        className={cn(
          "sticky top-0 z-10 flex h-12 items-center justify-center border-b border-border/80 bg-background/85 px-3 text-sm font-semibold text-muted-foreground backdrop-blur supports-[backdrop-filter]:bg-background/70",
          isToday && "bg-primary/10 text-primary supports-[backdrop-filter]:bg-primary/10"
        )}
      >
        <span className={cn("rounded-full px-2.5 py-1", isToday && "bg-primary text-primary-foreground shadow-sm")}>
          {DAY_LABELS[day]}
        </span>
      </div>
      <div className="relative" data-column>
        {slots.map((slot) => (
          <DroppableSlot
            key={slot}
            day={day}
            startMinutes={slot}
            onClick={() => openCreatePopover(slot)}
          />
        ))}
        {events.map((event) => (
          <EventBlock
            key={event.id}
            event={event}
            dayStart={settings.dayStart}
            dayEnd={settings.dayEnd}
            onClick={openEditPopover}
          />
        ))}
        <EventPopover
          open={isPopoverOpen}
          onOpenChange={setIsPopoverOpen}
          day={day}
          startMinutes={selectedStartMinutes}
          event={selectedEvent}
        />
      </div>
    </div>
  );
}
