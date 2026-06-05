import { useState } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';

const RESOLUTION_OPTIONS = [15, 30, 60] as const;

export function SettingsPanel() {
  const { settings, updateSettings } = useSettingsStore();
  const [error, setError] = useState<string | null>(null);
  const [dayStart, setDayStart] = useState(String(settings.dayStart / 60));
  const [dayEnd, setDayEnd] = useState(String(settings.dayEnd / 60));

  function handleDayStartChange(value: string) {
    setDayStart(value);
    const hours = Number(value);
    if (isNaN(hours) || hours < 0 || hours > 24) return;
    const minutes = hours * 60;
    if (minutes >= Number(dayEnd) * 60) {
      setError('Day start must be before day end.');
      return;
    }
    setError(null);
    updateSettings({ dayStart: minutes });
  }

  function handleDayEndChange(value: string) {
    setDayEnd(value);
    const hours = Number(value);
    if (isNaN(hours) || hours < 0 || hours > 24) return;
    const minutes = hours * 60;
    if (Number(dayStart) * 60 >= minutes) {
      setError('Day start must be before day end.');
      return;
    }
    setError(null);
    updateSettings({ dayEnd: minutes });
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" title="Settings">
          <span className="sr-only">Settings</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Planner Settings</SheetTitle>
          <SheetDescription>
            Configure time resolution, day bounds, and week start.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="time-resolution">Time Resolution</Label>
            <Select
              value={String(settings.timeResolution)}
              onValueChange={(value) =>
                updateSettings({ timeResolution: Number(value) as 15 | 30 | 60 })
              }
            >
              <SelectTrigger id="time-resolution">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RESOLUTION_OPTIONS.map((res) => (
                  <SelectItem key={res} value={String(res)}>
                    {res} minutes
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="day-start">Day Start (hour)</Label>
            <Input
              id="day-start"
              type="number"
              min={0}
              max={24}
              step={0.5}
              value={dayStart}
              onChange={(e) => handleDayStartChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="day-end">Day End (hour)</Label>
            <Input
              id="day-end"
              type="number"
              min={0}
              max={24}
              step={0.5}
              value={dayEnd}
              onChange={(e) => handleDayEndChange(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="space-y-2">
            <Label htmlFor="start-of-week">Start of Week</Label>
            <Select
              value={settings.startOfWeek}
              onValueChange={(value) =>
                updateSettings({ startOfWeek: value as 'mon' | 'sun' })
              }
            >
              <SelectTrigger id="start-of-week">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mon">Monday</SelectItem>
                <SelectItem value="sun">Sunday</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
