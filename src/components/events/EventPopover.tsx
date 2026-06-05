import { FormEvent, useEffect, useState } from 'react';
import { DEFAULT_CATEGORIES } from '../../lib/constants';
import { generateTimeSelectOptions, minutesToPosition } from '../../lib/time';
import { useCategoryStore } from '../../store/useCategoryStore';
import { useEventStore } from '../../store/useEventStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import type { DayOfWeek, RoutineEvent } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { CategoryPicker } from './CategoryPicker';
import { ColorPicker } from './ColorPicker';

interface EventPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  day: DayOfWeek;
  startMinutes: number;
  event?: RoutineEvent | null;
}

export function EventPopover({ open, onOpenChange, day, startMinutes, event }: EventPopoverProps) {
  const settings = useSettingsStore((state) => state.settings);
  const categories = useCategoryStore((state) => state.categories);
  const addEvent = useEventStore((state) => state.addEvent);
  const updateEvent = useEventStore((state) => state.updateEvent);
  const deleteEvent = useEventStore((state) => state.deleteEvent);
  const fallbackCategory = categories[0] ?? DEFAULT_CATEGORIES[0];
  const [title, setTitle] = useState('');
  const [start, setStart] = useState(startMinutes);
  const [end, setEnd] = useState(startMinutes + settings.timeResolution);
  const [categoryId, setCategoryId] = useState(fallbackCategory.id);
  const [color, setColor] = useState(fallbackCategory.color);
  const [error, setError] = useState('');
  const options = generateTimeSelectOptions(settings.dayStart, settings.dayEnd, settings.timeResolution);
  const anchorTop = minutesToPosition(start, settings.dayStart, settings.dayEnd);

  useEffect(() => {
    const selectedCategory = categories.find((category) => category.id === event?.categoryId) ?? fallbackCategory;

    setTitle(event?.title ?? '');
    setStart(event?.startMinutes ?? startMinutes);
    setEnd(event?.endMinutes ?? startMinutes + settings.timeResolution);
    setCategoryId(selectedCategory.id);
    setColor(event?.color ?? selectedCategory.color);
    setError('');
  }, [categories, event, fallbackCategory, settings.timeResolution, startMinutes]);

  const handleCategoryChange = (value: string) => {
    const category = categories.find((item) => item.id === value);

    setCategoryId(value);
    if (category) {
      setColor(category.color);
    }
  };

  const handleSubmit = (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();

    if (end <= start) {
      setError('End time must be after start time.');
      return;
    }

    const eventData = {
      title: title.trim() || 'Untitled event',
      day,
      startMinutes: start,
      endMinutes: end,
      categoryId,
      color,
    };

    if (event) {
      updateEvent(event.id, eventData);
    } else {
      addEvent(eventData);
    }

    onOpenChange(false);
  };

  const handleDelete = () => {
    if (event) {
      deleteEvent(event.id);
      onOpenChange(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Event form anchor"
          className="pointer-events-none absolute left-2 size-1 opacity-0"
          style={{ top: `${anchorTop}%` }}
          tabIndex={-1}
        />
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold">{event ? 'Edit event' : 'Create event'}</h2>
            <p className="text-xs text-muted-foreground">Set the title, time, category, and color.</p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="event-title">Title</Label>
            <Input id="event-title" value={title} onChange={(inputEvent) => setTitle(inputEvent.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="event-start">Start</Label>
              <Select value={String(start)} onValueChange={(value) => setStart(Number(value))}>
                <SelectTrigger id="event-start">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {options.map((option) => (
                      <SelectItem key={option.value} value={String(option.value)}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="event-end">End</Label>
              <Select value={String(end)} onValueChange={(value) => setEnd(Number(value))}>
                <SelectTrigger id="event-end" aria-invalid={end <= start}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {options.map((option) => (
                      <SelectItem key={option.value} value={String(option.value)}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="event-category">Category</Label>
            <CategoryPicker value={categoryId} onValueChange={handleCategoryChange} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Color</Label>
            <ColorPicker value={color} onValueChange={setColor} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-between gap-2">
            {event ? (
              <Button type="button" variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
