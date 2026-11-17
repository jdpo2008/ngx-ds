import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  linkedSignal,
  model,
  output,
  viewChild,
} from '@angular/core';
import { ChevronLeft, ChevronRight } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { addMonths, isSameDay, moveFocusDate, startOfDay, toWeeks } from '../../shared/day-cell';
import { NGX_DS_LOCALE, formatDayLabel, monthNames, weekdayNames } from '../../shared/locale';
import { NGX_DS_LABELS } from '../../shared/labels';

export interface CalendarDayCell {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

@Component({
  selector: 'ngx-ds-calendar',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  readonly i18n = inject(NGX_DS_LABELS);

  readonly value = model<Date | null>(null);
  readonly minDate = model<Date | null>(null);
  readonly maxDate = model<Date | null>(null);
  readonly disabled = model<boolean>(false);

  readonly dateSelect = output<Date>();

  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  /**
   * Day that owns the roving tabindex. The visible month is derived from it,
   * and it follows `value` when the selection changes from outside.
   */
  readonly #focusedDate = linkedSignal(() => startOfDay(this.value() ?? new Date()));
  readonly #viewMonth = computed(() => this.#focusedDate().getMonth());
  readonly #viewYear = computed(() => this.#focusedDate().getFullYear());
  readonly #injector = inject(Injector);
  readonly #locale = inject(NGX_DS_LOCALE);
  readonly #months = monthNames(this.#locale);

  private readonly gridRef = viewChild<ElementRef<HTMLElement>>('grid');

  /** Monday-first weekday labels. */
  readonly weekdays = (([sun, ...rest]) => [...rest, sun])(weekdayNames(this.#locale));

  readonly title = computed(() => `${this.#months[this.#viewMonth()]} ${this.#viewYear()}`);

  readonly days = computed(() => this.buildMonth(this.#viewYear(), this.#viewMonth()));

  readonly weeks = computed(() => toWeeks(this.days()));

  prevMonth(): void {
    this.#focusedDate.update((d) => addMonths(d, -1));
  }

  nextMonth(): void {
    this.#focusedDate.update((d) => addMonths(d, 1));
  }

  selectDay(cell: CalendarDayCell): void {
    if (cell.isDisabled || this.disabled()) return;
    this.value.set(cell.date);
    this.dateSelect.emit(cell.date);
  }

  /** True for the single day button reachable with Tab (roving tabindex). */
  isFocusTarget(cell: CalendarDayCell): boolean {
    return !this.disabled() && cell.inMonth && isSameDay(cell.date, this.#focusedDate());
  }

  dayLabel(d: Date): string {
    return formatDayLabel(d, this.#locale);
  }

  onDayKeydown(event: KeyboardEvent, cell: CalendarDayCell): void {
    if (this.disabled()) return;
    const next = moveFocusDate(cell.date, event);
    if (!next) return;
    event.preventDefault();
    this.#focusedDate.set(next);
    afterNextRender(
      () =>
        this.gridRef()
          ?.nativeElement.querySelector<HTMLElement>('[role="gridcell"][tabindex="0"]')
          ?.focus(),
      { injector: this.#injector },
    );
  }

  private buildMonth(year: number, month: number): CalendarDayCell[] {
    const cells: CalendarDayCell[] = [];
    const first = new Date(year, month, 1);
    const startDow = (first.getDay() + 6) % 7; // Monday-first

    for (let i = 0; i < startDow; i++) {
      cells.push(this.makeCell(new Date(year, month, 1 - (startDow - i)), false));
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

  private makeCell(date: Date, inMonth: boolean): CalendarDayCell {
    const min = this.minDate();
    const max = this.maxDate();
    const selected = this.value();
    const t = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const minT = min ? new Date(min.getFullYear(), min.getMonth(), min.getDate()) : null;
    const maxT = max ? new Date(max.getFullYear(), max.getMonth(), max.getDate()) : null;
    return {
      date,
      inMonth,
      isToday: isSameDay(date, new Date()),
      isSelected: isSameDay(date, selected),
      isDisabled: (!!minT && t < minT) || (!!maxT && t > maxT),
    };
  }
}
