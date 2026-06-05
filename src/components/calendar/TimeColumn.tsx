import { minutesToTimeString } from '../../lib/time';
import { useSettingsStore } from '../../store/useSettingsStore';

export function TimeColumn() {
  const settings = useSettingsStore((state) => state.settings);
  const timeLabels = Array.from(
    { length: Math.ceil((settings.dayEnd - settings.dayStart) / settings.timeResolution) },
    (_, index) => settings.dayStart + index * settings.timeResolution,
  );

  return (
    <div className="w-20 shrink-0 border-r border-slate-200 bg-white">
      <div className="sticky top-0 z-10 h-12 border-b border-slate-200 bg-white" />
      {timeLabels.map((minutes) => (
        <div
          key={minutes}
          className="flex h-12 items-start justify-end border-b border-slate-100 pr-3 pt-1 text-xs text-slate-500"
        >
          {minutesToTimeString(minutes)}
        </div>
      ))}
    </div>
  );
}
