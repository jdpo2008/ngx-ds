/** Celda base de un grid de calendario (42 celdas, 6 semanas). */
export interface DayCellBase {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
  isDisabled: boolean;
}

/** Celda de un calendario de selección única. */
export interface DayCell extends DayCellBase {
  isSelected: boolean;
}

/** True when both dates fall on the same calendar day. */
export function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  return (
    !!a &&
    !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** The given date at local midnight. */
export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Adds `n` months, clamping the day to the target month's length (31 Jan + 1 → 28/29 Feb). */
export function addMonths(date: Date, n: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + n, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(date.getDate(), lastDay));
  return target;
}

/** Splits a flat list of day cells into weeks of 7 (rows of the grid). */
export function toWeeks<T>(cells: T[]): T[][] {
  const weeks: T[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

/**
 * WAI-ARIA date-grid navigation. Returns the date the focus should move to for
 * `event`, or null when the key is not a navigation key:
 * - ArrowLeft / ArrowRight: previous / next day
 * - ArrowUp / ArrowDown: same day of the previous / next week
 * - Home / End: first / last day of the week (honours `firstDayOfWeek`)
 * - PageUp / PageDown: same day of the previous / next month (Shift: year)
 */
export function moveFocusDate(date: Date, event: KeyboardEvent, firstDayOfWeek = 1): Date | null {
  const day = (offset: number) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset);
  const weekStart = -((date.getDay() - firstDayOfWeek + 7) % 7);
  switch (event.key) {
    case 'ArrowLeft':
      return day(-1);
    case 'ArrowRight':
      return day(1);
    case 'ArrowUp':
      return day(-7);
    case 'ArrowDown':
      return day(7);
    case 'Home':
      return day(weekStart);
    case 'End':
      return day(weekStart + 6);
    case 'PageUp':
      return addMonths(date, event.shiftKey ? -12 : -1);
    case 'PageDown':
      return addMonths(date, event.shiftKey ? 12 : 1);
    default:
      return null;
  }
}
