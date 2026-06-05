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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { CategoryPicker } from './CategoryPicker';
import { ColorPicker } from './ColorPicker';

interface EventPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  day: DayOfWeek;
  startMinutes: number;
  event?: RoutineEvent | null;
}

function FormBody({
  title,
  onTitleChange,
  start,
  onStartChange,
  end,
  onEndChange,
  categoryId,
  onCategoryChange,
  color,
  onColorChange,
  error,
  hasEvent,
  onSubmit,
  onCancel,
  onDelete,
  options,
}: {
  title: string;
  onTitleChange: (value: string) => void;
  start: number;
  onStartChange: (value: number) => void;
  end: number;
  onEndChange: (value: number) => void;
  categoryId: string;
  onCategoryChange: (value: string) => void;
  color: string;
  onColorChange: (value: string) => void;
  error: string;
  hasEvent: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  onDelete: () => void;
  options: { value: number; label: string }[];
}) {
  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold">{hasEvent ? 'Edit event' : 'Create event'}</h2>
        <p className="text-xs text-muted-foreground">Set the title, time, category, and color.</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="event-title">Title</Label>
        <Input id="event-title" value={title} onChange={(e) => onTitleChange(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="event-start">Start</Label>
          <Select value={String(start)} onValueChange={(v) => onStartChange(Number(v))}>
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
          <Select value={String(end)} onValueChange={(v) => onEndChange(Number(v))}>
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
        <CategoryPicker value={categoryId} onValueChange={onCategoryChange} />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Color</Label>
        <ColorPicker value={color} onValueChange={onColorChange} />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-between gap-2">
        {hasEvent ? (
          <Button type="button" variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </div>
    </form>
  );
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
  const [isMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);

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

  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{event ? 'Edit event' : 'Create event'}</DialogTitle>
            <DialogDescription>Set the title, time, category, and color.</DialogDescription>
          </DialogHeader>
          <FormBody
            title={title}
            onTitleChange={setTitle}
            start={start}
            onStartChange={setStart}
            end={end}
            onEndChange={setEnd}
            categoryId={categoryId}
            onCategoryChange={handleCategoryChange}
            color={color}
            onColorChange={setColor}
            error={error}
            hasEvent={!!event}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            onDelete={handleDelete}
            options={options}
          />
        </DialogContent>
      </Dialog>
    );
  }

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
      <PopoverContent className="w-72 sm:w-80" align="start">
        <FormBody
          title={title}
          onTitleChange={setTitle}
          start={start}
          onStartChange={setStart}
          end={end}
          onEndChange={setEnd}
          categoryId={categoryId}
          onCategoryChange={handleCategoryChange}
          color={color}
          onColorChange={setColor}
          error={error}
          hasEvent={!!event}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          onDelete={handleDelete}
          options={options}
        />
      </PopoverContent>
    </Popover>
  );
}
