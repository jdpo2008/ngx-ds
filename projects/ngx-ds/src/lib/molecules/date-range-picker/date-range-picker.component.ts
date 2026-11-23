import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  signal,
  computed,
  forwardRef,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldErrors, fieldErrorText, fieldHasError } from '../../shared/field-error';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import {
  DayCellBase,
  addMonths,
  isSameDay,
  moveFocusDate,
  startOfDay,
  toWeeks,
} from '../../shared/day-cell';
import { setupClickOutside } from '../../shared/click-outside';
import { setupEscapeClose } from '../../shared/escape-close';
import { isActivationKey } from '../../shared/keyboard';
import { NGX_DS_LOCALE, formatDayLabel, monthNames, weekdayNames } from '../../shared/locale';
import { Size } from '../../shared/size';
import { NGX_DS_LABELS } from '../../shared/labels';

export type DateRangePickerSize = Size;

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export type { DayCellBase } from '../../shared/day-cell';

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
  readonly i18n = inject(NGX_DS_LABELS);

  readonly label = input<string>('');
  readonly placeholder = input<string | undefined>(undefined);
  readonly size = input<DateRangePickerSize>('md');
  readonly hint = input<string>('');
  readonly errorMessage = input<string>('');
  /** Set by Signal Forms `[formField]`. Its errors show once the field is touched. */
  readonly errors = input<FieldErrors>([]);
  readonly touched = input<boolean>(false);
  readonly minDate = input<Date | null>(null);
  readonly maxDate = input<Date | null>(null);
  readonly disabled = input<boolean>(false);
  readonly #formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.#formDisabled());

  readonly start = model<Date | null>(null);
  readonly end = model<Date | null>(null);

  readonly id = `ngx-drp-${nextId++}`;
  readonly messageId = `${this.id}-message`;

  readonly CalendarIcon = Calendar;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  readonly #open = signal(false);
  readonly #hover = signal<Date | null>(null);
  readonly #viewMonth = signal(new Date().getMonth());
  readonly #viewYear = signal(new Date().getFullYear());
  readonly #picking = signal<'start' | 'end'>('start'); // which end we're setting next
  /** Range when the panel opened; restored if it closes before the end is picked. */
  #committed: DateRange = { start: null, end: null };
  /** Day that owns the roving tabindex; always inside one of the two visible months. */
  readonly #focusedDate = signal<Date>(startOfDay(new Date()));
  readonly #injector = inject(Injector);
  readonly #locale = inject(NGX_DS_LOCALE);
  readonly #months = monthNames(this.#locale);

  readonly isOpen = this.#open.asReadonly();
  readonly placeholderText = computed(() => this.placeholder() ?? this.i18n.datePlaceholder);

  readonly weekdays = weekdayNames(this.#locale);

  // ── Trigger label ────────────────────────────────────────────────────────

  readonly triggerLabel = computed(() => {
    const s = this.start();
    const e = this.end();
    if (!s && !e) return '';
    const fmt = (d: Date) =>
      `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    if (s && e) return `${fmt(s)} – ${fmt(e)}`;
    if (s) return `${fmt(s)} – ...`;
    return `... – ${fmt(e!)}`;
  });

  readonly hasError = computed(() =>
    fieldHasError(this.errorMessage(), this.errors(), this.touched()),
  );
  readonly errorText = computed(() =>
    fieldErrorText(this.errorMessage(), this.errors(), this.touched()),
  );

  readonly triggerClasses = computed(() => {
    const base = `drp__trigger drp__trigger--${this.size()}`;
    if (this.isDisabled()) return base + ' drp__trigger--disabled';
    if (this.#open()) return base + ' drp__trigger--open';
    if (this.hasError()) return base + ' drp__trigger--error';
    return base;
  });

  // ── Left calendar (current view) ─────────────────────────────────────────

  readonly leftTitle = computed(() => `${this.#months[this.#viewMonth()]} ${this.#viewYear()}`);

  readonly rightViewMonth = computed(() => (this.#viewMonth() + 1) % 12);
  readonly rightViewYear = computed(() =>
    this.#viewMonth() === 11 ? this.#viewYear() + 1 : this.#viewYear(),
  );

  readonly rightTitle = computed(
    () => `${this.#months[this.rightViewMonth()]} ${this.rightViewYear()}`,
  );

  readonly leftDays = computed(() => this.buildMonth(this.#viewYear(), this.#viewMonth()));
  readonly rightDays = computed(() => this.buildMonth(this.rightViewYear(), this.rightViewMonth()));

  readonly leftWeeks = computed(() => toWeeks(this.leftDays()));
  readonly rightWeeks = computed(() => toWeeks(this.rightDays()));

  // ── Day state helpers ─────────────────────────────────────────────────────

  isStart(d: Date): boolean {
    return isSameDay(d, this.start());
  }

  isEnd(d: Date): boolean {
    return isSameDay(d, this.end());
  }

  isSelected(d: Date): boolean {
    return this.isStart(d) || this.isEnd(d) || this.inRange(d);
  }

  /** True for the single day button reachable with Tab (roving tabindex). */
  isFocusTarget(cell: DayCellBase): boolean {
    return cell.inMonth && isSameDay(cell.date, this.#focusedDate());
  }

  dayLabel(d: Date): string {
    return formatDayLabel(d, this.#locale);
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
    this.#shiftView(-1);
  }

  nextMonth(): void {
    this.#shiftView(1);
  }

  /** Moves both calendars by `n` months; the focused day moves with them. */
  #shiftView(n: number): void {
    this.#setView(addMonths(new Date(this.#viewYear(), this.#viewMonth(), 1), n));
    this.#focusedDate.update((d) => addMonths(d, n));
  }

  #setView(firstOfLeftMonth: Date): void {
    this.#viewMonth.set(firstOfLeftMonth.getMonth());
    this.#viewYear.set(firstOfLeftMonth.getFullYear());
  }

  // ── Keyboard grid navigation ──────────────────────────────────────────────

  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');

  onDayKeydown(event: KeyboardEvent, cell: DayCellBase): void {
    const next = moveFocusDate(cell.date, event);
    if (!next) return;
    event.preventDefault();
    this.#focusDate(next);
    this.#focusGridAfterRender();
  }

  /** Focuses `date`, scrolling the two-month view only when it falls outside it. */
  #focusDate(date: Date): void {
    const left = new Date(this.#viewYear(), this.#viewMonth(), 1);
    const afterRight = addMonths(left, 2);
    const month = new Date(date.getFullYear(), date.getMonth(), 1);
    if (month < left) this.#setView(month);
    else if (month >= afterRight) this.#setView(addMonths(month, -1));
    this.#focusedDate.set(date);
    if (this.#picking() === 'end') this.#hover.set(date);
  }

  #focusGridAfterRender(): void {
    afterNextRender(
      () =>
        this.panelRef()
          ?.nativeElement.querySelector<HTMLElement>('[role="gridcell"][tabindex="0"]')
          ?.focus(),
      { injector: this.#injector },
    );
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
      this.triggerRef()?.nativeElement.focus();
    }
  }

  onHover(cell: DayCellBase): void {
    if (this.#picking() === 'end' && !cell.isDisabled) this.#hover.set(cell.date);
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
      if (this.isOpen()) this.#cancel();
      else this.openCalendar();
    }
  }

  #closeOnEscape(): void {
    if (!this.isOpen()) return;
    this.#cancel();
    this.triggerRef()?.nativeElement.focus();
  }

  /** Closes without a full pick: a half-picked range goes back to what it was. */
  #cancel(): void {
    this.#open.set(false);
    this.#hover.set(null);
    if (this.#picking() === 'end') {
      this.start.set(this.#committed.start);
      this.end.set(this.#committed.end);
      this.#picking.set('start');
    }
  }

  openCalendar(): void {
    if (this.isDisabled()) return;
    this.#open.set(true);
    this.#picking.set('start');
    this.#committed = { start: this.start(), end: this.end() };
    const focus = startOfDay(this.start() ?? new Date());
    this.#setView(new Date(focus.getFullYear(), focus.getMonth(), 1));
    this.#focusedDate.set(focus);
    this.#focusGridAfterRender();
  }

  clear(event: MouseEvent): void {
    event.stopPropagation();
    this.start.set(null);
    this.end.set(null);
    this.#open.set(false);
    this.#picking.set('start');
    this.#hover.set(null);
    this.#emitChange();
    // The clear button goes away with the value; keep focus on the field.
    this.triggerRef()?.nativeElement.focus();
  }

  constructor() {
    setupEscapeClose(() => this.#closeOnEscape());
    setupClickOutside(() => {
      if (!this.#open()) return;
      this.#cancel();
      this.#onTouched();
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
  setDisabledState(isDisabled: boolean): void {
    this.#formDisabled.set(isDisabled);
  }
}
