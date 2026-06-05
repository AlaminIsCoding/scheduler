import { useSettingsStore } from '../store/useSettingsStore';
import { isWithinDayBounds, parseSlotId, snapToGrid } from '../lib/time';
import type { DayOfWeek } from '../types';

export interface SnappedPosition {
  day: DayOfWeek;
  startMinutes: number;
}

/**
 * Hook that provides grid-snap helpers driven by current settings.
 */
export function useGridSnap() {
  const { timeResolution, dayStart, dayEnd } = useSettingsStore((s) => s.settings);

  /**
   * Snap a raw minute value to the nearest grid boundary.
   */
  function snap(minutes: number): number {
    return snapToGrid(minutes, timeResolution);
  }

  /**
   * Convert a pixel offset within a column to snapped minutes.
   * @param offsetY  pixel offset from the top of the column
   * @param columnHeight  total pixel height of the column
   */
  function pixelToSnappedMinutes(offsetY: number, columnHeight: number): number {
    if (columnHeight <= 0) return dayStart;
    const totalMinutes = dayEnd - dayStart;
    const rawMinutes = dayStart + (offsetY / columnHeight) * totalMinutes;
    return snapToGrid(rawMinutes, timeResolution);
  }

  /**
   * Parse a slot ID and validate the resulting position fits a given duration
   * within the day bounds.
   */
  function resolveSlotDrop(
    slotId: string,
    durationMinutes: number,
  ): SnappedPosition | null {
    const parsed = parseSlotId(slotId);
    if (!parsed) return null;

    const snappedStart = snapToGrid(parsed.startMinutes, timeResolution);
    const endMinutes = snappedStart + durationMinutes;

    if (!isWithinDayBounds(snappedStart, endMinutes, dayStart, dayEnd)) {
      return null;
    }

    return { day: parsed.day, startMinutes: snappedStart };
  }

  return { snap, pixelToSnappedMinutes, resolveSlotDrop, timeResolution, dayStart, dayEnd };
}
