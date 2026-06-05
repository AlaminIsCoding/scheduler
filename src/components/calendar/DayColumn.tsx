import { DAY_LABELS } from '../../lib/constants';
import { useSettingsStore } from '../../store/useSettingsStore';
import type { DayOfWeek } from '../../types';

interface DayColumnProps {
  day: DayOfWeek;
}

export function DayColumn({ day }: DayColumnProps) {
  const settings = useSettingsStore((state) => state.settings);
  const slotCount = Math.ceil((settings.dayEnd - settings.dayStart) / settings.timeResolution);
  const slots = Array.from({ length: slotCount }, (_, index) => index);

  return (
    <div className="min-w-40 flex-1 border-r border-slate-200 bg-white" aria-label={DAY_LABELS[day]}>
      <div className="sticky top-0 z-10 flex h-12 items-center justify-center border-b border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700">
        {DAY_LABELS[day]}
      </div>
      {slots.map((slot) => (
        <div key={slot} className="h-12 border-b border-slate-100" />
      ))}
    </div>
  );
}
