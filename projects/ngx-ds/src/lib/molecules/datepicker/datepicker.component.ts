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
import { Calendar, X, ChevronLeft, ChevronRight } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import {
  DayCell,
  addMonths,
  isSameDay,
  moveFocusDate,
  startOfDay,
  toWeeks,
} from '../../shared/day-cell';
import { setupClickOutside } from '../../shared/click-outside';
import { setupEscapeClose } from '../../shared/escape-close';
import { isActivationKey } from '../../shared/keyboard';
import { Size } from '../../shared/size';

export type DatepickerSize = Size;

export type { DayCell } from '../../shared/day-cell';

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

const ICON_SIZE: Record<DatepickerSize, number> = { sm: 14, md: 16, lg: 18 };

let nextId = 0;

@Component({
  selector: 'ngx-ds-datepicker',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    },
  ],
})
export class DatepickerComponent implements ControlValueAccessor {
  // ── Configuration ─────────────────────────────────────────
  readonly label = input<string>('');
  readonly floatingLabel = input<boolean>(false);
  readonly placeholder = input<string>('DD/MM/AAAA');
  readonly size = input<DatepickerSize>('md');
  readonly hint = input<string>('');
  readonly errorMessage = input<string>('');
  readonly minDate = input<Date | null>(null);
  readonly maxDate = input<Date | null>(null);
  readonly disabledDates = input<Date[]>([]);
  readonly disabledDaysOfWeek = input<number[]>([]); // 0=Dom … 6=Sáb
  readonly firstDayOfWeek = input<number>(1); // 1=Lunes
  readonly showToday = input<boolean>(true);

  // ── Value ────────────────────────────────────────────────
  readonly value = model<Date | null>(null);

  readonly id = `ngx-datepicker-${nextId++}`;

  // ── Icons ────────────────────────────────────────────────
  readonly CalendarIcon = Calendar;
  readonly XIcon = X;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  // ── Internal state ────────────────────────────────────────
  readonly #open = signal(false);
  readonly #focused = signal(false);
  readonly #disabled = signal(false);
  /** Day that owns the roving tabindex in the grid; the visible month follows it. */
  readonly #focusedDate = signal<Date>(startOfDay(new Date()));
  readonly #viewMonth = computed(() => this.#focusedDate().getMonth());
  readonly #viewYear = computed(() => this.#focusedDate().getFullYear());
  readonly #injector = inject(Injector);

  readonly isOpen = this.#open.asReadonly();
  readonly isDisabled = this.#disabled.asReadonly();
  readonly isFocused = this.#focused.asReadonly();

  // ── Derived ───────────────────────────────────────────────
  readonly iconSize = computed(() => ICON_SIZE[this.size()]);
  readonly hasError = computed(() => this.errorMessage().length > 0);
  readonly hasValue = computed(() => this.value() !== null);

  readonly isFloating = computed(() => this.#focused() || this.hasValue());

  readonly displayValue = computed(() => {
    const d = this.value();
    if (!d) return '';
    return [
      String(d.getDate()).padStart(2, '0'),
      String(d.getMonth() + 1).padStart(2, '0'),
      d.getFullYear(),
    ].join('/');
  });

  readonly headerText = computed(() => `${MONTHS_ES[this.#viewMonth()]} ${this.#viewYear()}`);

  readonly weekdayLabels = computed(() => {
    const fdow = this.firstDayOfWeek();
    return [...WEEKDAYS_ES.slice(fdow), ...WEEKDAYS_ES.slice(0, fdow)];
  });

  readonly calendarDays = computed((): DayCell[] => {
    const month = this.#viewMonth();
    const year = this.#viewYear();
    const fdow = this.firstDayOfWeek();
    const sel = this.value();
    const min = this.minDate();
    const max = this.maxDate();
    const dDays = this.disabledDaysOfWeek();
    const dDates = this.disabledDates();

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const selDay = sel ? new Date(sel.getFullYear(), sel.getMonth(), sel.getDate()) : null;
    const minDay = min ? new Date(min.getFullYear(), min.getMonth(), min.getDate()) : null;
    const maxDay = max ? new Date(max.getFullYear(), max.getMonth(), max.getDate()) : null;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstOfMonth = new Date(year, month, 1);
    const offset = (firstOfMonth.getDay() - fdow + 7) % 7;

    const makeCell = (date: Date, inMonth: boolean): DayCell => {
      const t = date.getTime();
      const isDisabled =
        (minDay !== null && date < minDay) ||
        (maxDay !== null && date > maxDay) ||
        dDays.includes(date.getDay()) ||
        dDates.some((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() === t);

      return {
        date,
        inMonth,
        isToday: date.getTime() === today.getTime(),
        isSelected: selDay !== null && date.getTime() === selDay.getTime(),
        isDisabled,
      };
    };

    const cells: DayCell[] = [];

    for (let i = offset; i > 0; i--) cells.push(makeCell(new Date(year, month, 1 - i), false));

    for (let d = 1; d <= daysInMonth; d++) cells.push(makeCell(new Date(year, month, d), true));

    let next = 1;
    while (cells.length < 42) cells.push(makeCell(new Date(year, month + 1, next++), false));

    return cells;
  });

  readonly calendarWeeks = computed(() => toWeeks(this.calendarDays()));

  // ── Click outside ─────────────────────────────────────────
  constructor() {
    setupEscapeClose(() => this.#closeOnEscape());
    setupClickOutside(() => {
      this.#open.set(false);
      this.#focused.set(false);
      this.onTouched();
    });
  }

  // ── Interactions ──────────────────────────────────────────
  // ── Keyboard ───────────────────────────────────────────────
  private readonly triggerRef = viewChild<ElementRef<HTMLElement>>('trigger');
  private readonly gridRef = viewChild<ElementRef<HTMLElement>>('grid');

  /** True for the single day button reachable with Tab (roving tabindex). */
  isFocusTarget(cell: DayCell): boolean {
    return cell.inMonth && isSameDay(cell.date, this.#focusedDate());
  }

  onDayKeydown(event: KeyboardEvent, cell: DayCell): void {
    const next = moveFocusDate(cell.date, event, this.firstDayOfWeek());
    if (!next) return;
    event.preventDefault();
    this.#focusedDate.set(next);
    this.#focusGridAfterRender();
  }

  #focusGridAfterRender(): void {
    afterNextRender(
      () =>
        this.gridRef()
          ?.nativeElement.querySelector<HTMLElement>('[role="gridcell"][tabindex="0"]')
          ?.focus(),
      { injector: this.#injector },
    );
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    // Ignore keys coming from nested controls (clear / chip-remove buttons).
    if (event.target !== event.currentTarget) return;
    if (isActivationKey(event) || (event.key === 'ArrowDown' && !this.isOpen())) {
      event.preventDefault();
      this.togglePanel();
    }
  }

  #closeOnEscape(): void {
    if (!this.isOpen()) return;
    this.#open.set(false);
    this.#focused.set(false);
    this.triggerRef()?.nativeElement.focus();
  }

  togglePanel(): void {
    if (this.isDisabled()) return;
    const opening = !this.#open();
    this.#open.set(opening);
    this.#focused.set(opening);
    if (opening) {
      this.syncViewToValue();
      this.#focusGridAfterRender();
    }
  }

  prevMonth(): void {
    this.#focusedDate.update((d) => addMonths(d, -1));
  }

  nextMonth(): void {
    this.#focusedDate.update((d) => addMonths(d, 1));
  }

  selectDate(cell: DayCell): void {
    if (cell.isDisabled || this.isDisabled()) return;
    this.value.set(cell.date);
    this.onChange(cell.date);
    this.#open.set(false);
    this.#focused.set(false);
    this.triggerRef()?.nativeElement.focus();
  }

  selectToday(): void {
    const today = new Date();
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const cell: DayCell = {
      date: d,
      inMonth: true,
      isToday: true,
      isSelected: false,
      isDisabled: this.isDateDisabled(d),
    };
    if (!cell.isDisabled) this.selectDate(cell);
  }

  clearValue(event: Event): void {
    event.stopPropagation();
    if (this.isDisabled()) return;
    this.value.set(null);
    this.onChange(null);
  }

  trackByTime(_: number, cell: DayCell): number {
    return cell.date.getTime();
  }

  // ── Helpers ───────────────────────────────────────────────
  private syncViewToValue(): void {
    this.#focusedDate.set(startOfDay(this.value() ?? new Date()));
  }

  private isDateDisabled(date: Date): boolean {
    const min = this.minDate();
    const max = this.maxDate();
    const dDays = this.disabledDaysOfWeek();
    const minD = min ? new Date(min.getFullYear(), min.getMonth(), min.getDate()) : null;
    const maxD = max ? new Date(max.getFullYear(), max.getMonth(), max.getDate()) : null;
    return (
      (minD !== null && date < minD) ||
      (maxD !== null && date > maxD) ||
      dDays.includes(date.getDay())
    );
  }

  readonly fieldClasses = computed(() => {
    const base = 'ngx-datepicker__field';
    return [
      base,
      `${base}--${this.size()}`,
      this.isFocused() ? `${base}--focused` : '',
      this.hasError() ? `${base}--error` : '',
      this.isDisabled() ? `${base}--disabled` : '',
      this.floatingLabel() ? `${base}--floating` : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  readonly floatLabelClasses = computed(() => {
    const base = 'ngx-datepicker__float-label';
    return [
      base,
      this.isFloating() ? `${base}--active` : '',
      this.isFocused() ? `${base}--focused` : '',
      this.hasError() ? `${base}--error` : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  // ── CVA ───────────────────────────────────────────────────
  private onChange: (v: Date | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: Date | null): void {
    this.value.set(v ?? null);
    if (v) this.#focusedDate.set(startOfDay(v));
  }

  registerOnChange(fn: (v: Date | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.#disabled.set(disabled);
  }
}
