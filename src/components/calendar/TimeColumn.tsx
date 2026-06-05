import { minutesToTimeString } from '../../lib/time';
import { useSettingsStore } from '../../store/useSettingsStore';

export function TimeColumn() {
  const settings = useSettingsStore((state) => state.settings);
  const timeLabels = Array.from(
    { length: Math.ceil((settings.dayEnd - settings.dayStart) / settings.timeResolution) },
    (_, index) => settings.dayStart + index * settings.timeResolution,
  );

  return (
    <div className="w-20 shrink-0 border-r border-border/70 bg-muted/30">
      <div className="sticky top-0 z-10 h-12 border-b border-border/80 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70" />
      {timeLabels.map((minutes) => (
        <div
          key={minutes}
          className="flex h-12 items-start justify-end border-b border-border/50 pr-3 pt-2 text-[11px] font-medium tabular-nums text-muted-foreground"
        >
          {minutesToTimeString(minutes)}
        </div>
      ))}
    </div>
  );
}
