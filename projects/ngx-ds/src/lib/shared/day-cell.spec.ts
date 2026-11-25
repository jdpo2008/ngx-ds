import { addMonths, clampDate, isSameDay, moveFocusDate, toWeeks } from './day-cell';

const key = (k: string, shiftKey = false) => new KeyboardEvent('keydown', { key: k, shiftKey });
const ymd = (d: Date | null) => (d ? [d.getFullYear(), d.getMonth() + 1, d.getDate()] : null);

describe('day-cell helpers', () => {
  it('addMonths clamps the day to the target month', () => {
    expect(ymd(addMonths(new Date(2026, 0, 31), 1))).toEqual([2026, 2, 28]);
    expect(ymd(addMonths(new Date(2024, 0, 31), 1))).toEqual([2024, 2, 29]);
    expect(ymd(addMonths(new Date(2026, 0, 15), -1))).toEqual([2025, 12, 15]);
  });

  it('clampDate keeps the date within whole-day bounds', () => {
    const min = new Date(2026, 0, 10, 15);
    const max = new Date(2026, 0, 20, 15);
    expect(ymd(clampDate(new Date(2026, 0, 5), min, max))).toEqual([2026, 1, 10]);
    expect(clampDate(new Date(2026, 0, 5), min, max).getHours()).toBe(0);
    expect(ymd(clampDate(new Date(2026, 0, 25), min, max))).toEqual([2026, 1, 20]);
    expect(ymd(clampDate(new Date(2026, 0, 20), min, max))).toEqual([2026, 1, 20]);
    expect(ymd(clampDate(new Date(2026, 0, 25), null, null))).toEqual([2026, 1, 25]);
  });

  it('isSameDay ignores the time and tolerates null', () => {
    expect(isSameDay(new Date(2026, 4, 3, 9), new Date(2026, 4, 3, 23))).toBe(true);
    expect(isSameDay(new Date(2026, 4, 3), null)).toBe(false);
  });

  it('toWeeks chunks cells into rows of 7', () => {
    const weeks = toWeeks(Array.from({ length: 42 }, (_, i) => i));
    expect(weeks.length).toBe(6);
    expect(weeks[1]).toEqual([7, 8, 9, 10, 11, 12, 13]);
  });

  describe('moveFocusDate', () => {
    const thu = new Date(2026, 0, 15); // Thursday

    it('moves by day and week with the arrows', () => {
      expect(ymd(moveFocusDate(thu, key('ArrowLeft')))).toEqual([2026, 1, 14]);
      expect(ymd(moveFocusDate(thu, key('ArrowRight')))).toEqual([2026, 1, 16]);
      expect(ymd(moveFocusDate(thu, key('ArrowUp')))).toEqual([2026, 1, 8]);
      expect(ymd(moveFocusDate(thu, key('ArrowDown')))).toEqual([2026, 1, 22]);
    });

    it('Home / End honour the first day of the week', () => {
      expect(ymd(moveFocusDate(thu, key('Home')))).toEqual([2026, 1, 12]); // Monday
      expect(ymd(moveFocusDate(thu, key('End')))).toEqual([2026, 1, 18]); // Sunday
      expect(ymd(moveFocusDate(thu, key('Home'), 0))).toEqual([2026, 1, 11]); // Sunday
      expect(ymd(moveFocusDate(thu, key('End'), 0))).toEqual([2026, 1, 17]); // Saturday
    });

    it('PageUp / PageDown move by month, or by year with Shift', () => {
      expect(ymd(moveFocusDate(thu, key('PageDown')))).toEqual([2026, 2, 15]);
      expect(ymd(moveFocusDate(thu, key('PageUp')))).toEqual([2025, 12, 15]);
      expect(ymd(moveFocusDate(thu, key('PageDown', true)))).toEqual([2027, 1, 15]);
      expect(ymd(moveFocusDate(thu, key('PageUp', true)))).toEqual([2025, 1, 15]);
    });

    it('returns null for other keys', () => {
      expect(moveFocusDate(thu, key('a'))).toBeNull();
      expect(moveFocusDate(thu, key('Enter'))).toBeNull();
    });
  });
});
