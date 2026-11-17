import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  signal,
  computed,
  forwardRef,
  ElementRef,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { DayCellBase } from '../../shared/day-cell';
import { setupClickOutside } from '../../shared/click-outside';
import { setupEscapeClose } from '../../shared/escape-close';
import { isActivationKey } from '../../shared/keyboard';
import { Size } from '../../shared/size';

export type DateRangePickerSize = Size;

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export type { DayCellBase } from '../../shared/day-cell';

const MONTHS_ES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const WEEKDAYS_ES = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

let nextId = 0;

@Component({
  selector: 'ngx-ds-date-range-picker',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true,
    },
  ],
})
export class DateRangePickerComponent implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly placeholder = input<string>('DD/MM/AAAA');
  readonly size = input<DateRangePickerSize>('md');
  readonly hint = input<string>('');
  readonly errorMessage = input<string>('');
  readonly minDate = input<Date | null>(null);
  readonly maxDate = input<Date | null>(null);
  readonly disabled = input<boolean>(false);

  readonly start = model<Date | null>(null);
  readonly end = model<Date | null>(null);

  readonly id = `ngx-drp-${nextId++}`;

  readonly CalendarIcon = Calendar;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  readonly #open = signal(false);
  readonly #hover = signal<Date | null>(null);
  readonly #viewMonth = signal(new Date().getMonth());
  readonly #viewYear = signal(new Date().getFullYear());
  readonly #picking = signal<'start' | 'end'>('start'); // which end we're setting next

  readonly isOpen = this.#open.asReadonly();

  readonly weekdays = WEEKDAYS_ES;

  // ── Trigger label ────────────────────────────────────────────────────────

  readonly triggerLabel = computed(() => {
    const s = this.start();
    const e = this.end();
    if (!s && !e) return '';
    const fmt = (d: Date) =>
      `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    if (s && e) return `${fmt(s)} – ${fmt(e)}`;
    if (s) return `${fmt(s)} – ...`;
    return '';
  });

  readonly triggerClasses = computed(() => {
    const base = `drp__trigger drp__trigger--${this.size()}`;
    if (this.#open()) return base + ' drp__trigger--open';
    if (this.errorMessage()) return base + ' drp__trigger--error';
    return base;
  });

  // ── Left calendar (current view) ─────────────────────────────────────────

  readonly leftTitle = computed(() => `${MONTHS_ES[this.#viewMonth()]} ${this.#viewYear()}`);

  readonly rightViewMonth = computed(() => (this.#viewMonth() + 1) % 12);
  readonly rightViewYear = computed(() =>
    this.#viewMonth() === 11 ? this.#viewYear() + 1 : this.#viewYear(),
  );

  readonly rightTitle = computed(
    () => `${MONTHS_ES[this.rightViewMonth()]} ${this.rightViewYear()}`,
  );

  readonly leftDays = computed(() => this.buildMonth(this.#viewYear(), this.#viewMonth()));
  readonly rightDays = computed(() => this.buildMonth(this.rightViewYear(), this.rightViewMonth()));

  // ── Day state helpers ─────────────────────────────────────────────────────

  isStart(d: Date): boolean {
    const s = this.start();
    return !!s && isSameDay(d, s);
  }

  isEnd(d: Date): boolean {
    const e = this.end();
    return !!e && isSameDay(d, e);
  }

  inRange(d: Date): boolean {
    const s = this.start();
    const hover = this.#hover();
    const rangeEnd = this.end() ?? hover;
    if (!s || !rangeEnd) return false;
    const lo = startOfDay(s < rangeEnd ? s : rangeEnd);
    const hi = startOfDay(s < rangeEnd ? rangeEnd : s);
    const t = startOfDay(d);
    return t > lo && t < hi;
  }

  isToday(d: Date): boolean {
    return isSameDay(d, new Date());
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  prevMonth(): void {
    if (this.#viewMonth() === 0) {
      this.#viewMonth.set(11);
      this.#viewYear.update((y) => y - 1);
    } else {
      this.#viewMonth.update((m) => m - 1);
    }
  }

  nextMonth(): void {
    if (this.#viewMonth() === 10) {
      this.#viewMonth.set(11);
    } else if (this.#viewMonth() === 11) {
      this.#viewMonth.set(0);
      this.#viewYear.update((y) => y + 1);
    } else {
      this.#viewMonth.update((m) => m + 1);
    }
  }

  // ── Day selection ─────────────────────────────────────────────────────────

  selectDay(cell: DayCellBase): void {
    if (cell.isDisabled) return;
    const d = startOfDay(cell.date);

    if (this.#picking() === 'start') {
      this.start.set(d);
      this.end.set(null);
      this.#picking.set('end');
    } else {
      const s = this.start();
      if (s && d < s) {
        this.start.set(d);
        this.end.set(s);
      } else {
        this.end.set(d);
      }
      this.#picking.set('start');
      this.#open.set(false);
      this.#hover.set(null);
      this.#emitChange();
    }
  }

  onHover(cell: DayCellBase): void {
    if (this.#picking() === 'end') this.#hover.set(cell.date);
  }

  onLeave(): void {
    this.#hover.set(null);
  }

  // ── Open / Close ──────────────────────────────────────────────────────────

  // ── Keyboard ───────────────────────────────────────────────
  private readonly triggerRef = viewChild<ElementRef<HTMLElement>>('trigger');

  onTriggerKeydown(event: KeyboardEvent): void {
    // Ignore keys coming from nested controls (clear / chip-remove buttons).
    if (event.target !== event.currentTarget) return;
    if (isActivationKey(event) || (event.key === 'ArrowDown' && !this.isOpen())) {
      event.preventDefault();
      if (this.isOpen()) this.#open.set(false);
      else this.openCalendar();
    }
  }

  #closeOnEscape(): void {
    if (!this.isOpen()) return;
    this.#open.set(false);
    this.triggerRef()?.nativeElement.focus();
  }

  openCalendar(): void {
    if (this.disabled()) return;
    this.#open.set(true);
    this.#picking.set('start');
    const s = this.start();
    if (s) {
      this.#viewMonth.set(s.getMonth());
      this.#viewYear.set(s.getFullYear());
    }
  }

  clear(event: MouseEvent): void {
    event.stopPropagation();
    this.start.set(null);
    this.end.set(null);
    this.#open.set(false);
    this.#emitChange();
  }

  constructor() {
    setupEscapeClose(() => this.#closeOnEscape());
    setupClickOutside(() => {
      if (!this.#open()) return;
      this.#open.set(false);
    });
  }

  // ── Calendar grid ────────────────────────────────────────────────────────

  private buildMonth(year: number, month: number): DayCellBase[] {
    const cells: DayCellBase[] = [];
    const first = new Date(year, month, 1);
    const startDow = (first.getDay() + 6) % 7; // Monday-first

    for (let i = 0; i < startDow; i++) {
      const d = new Date(year, month, 1 - (startDow - i));
      cells.push(this.makeCell(d, false));
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(this.makeCell(new Date(year, month, d), true));
    }

    const trailing = 42 - cells.length;
    for (let i = 1; i <= trailing; i++) {
      cells.push(this.makeCell(new Date(year, month + 1, i), false));
    }

    return cells;
  }

  private makeCell(date: Date, inMonth: boolean): DayCellBase {
    const min = this.minDate();
    const max = this.maxDate();
    const t = startOfDay(date);
    const isDisabled = (!!min && t < startOfDay(min)) || (!!max && t > startOfDay(max));
    return { date, inMonth, isToday: isSameDay(date, new Date()), isDisabled };
  }

  // ── CVA ──────────────────────────────────────────────────────────────────

  #onChange: (v: DateRange) => void = () => {};
  #onTouched: () => void = () => {};

  #emitChange(): void {
    this.#onChange({ start: this.start(), end: this.end() });
    this.#onTouched();
  }

  writeValue(v: DateRange | null): void {
    this.start.set(v?.start ?? null);
    this.end.set(v?.end ?? null);
  }
  registerOnChange(fn: (v: DateRange) => void): void {
    this.#onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.#onTouched = fn;
  }
  setDisabledState(_d: boolean): void {}
}
