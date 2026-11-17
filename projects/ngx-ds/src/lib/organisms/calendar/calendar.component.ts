import { ChangeDetectionStrategy, Component, computed, model, output, signal } from '@angular/core';
import { ChevronLeft, ChevronRight } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';

export interface CalendarDayCell {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

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

const WEEKDAYS_ES = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
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
  readonly value = model<Date | null>(null);
  readonly minDate = model<Date | null>(null);
  readonly maxDate = model<Date | null>(null);
  readonly disabled = model<boolean>(false);

  readonly dateSelect = output<Date>();

  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  readonly #viewMonth = signal(new Date().getMonth());
  readonly #viewYear = signal(new Date().getFullYear());

  readonly weekdays = WEEKDAYS_ES;

  readonly title = computed(() => `${MONTHS_ES[this.#viewMonth()]} ${this.#viewYear()}`);

  readonly days = computed(() => this.buildMonth(this.#viewYear(), this.#viewMonth()));

  prevMonth(): void {
    if (this.#viewMonth() === 0) {
      this.#viewMonth.set(11);
      this.#viewYear.update((y) => y - 1);
    } else {
      this.#viewMonth.update((m) => m - 1);
    }
  }

  nextMonth(): void {
    if (this.#viewMonth() === 11) {
      this.#viewMonth.set(0);
      this.#viewYear.update((y) => y + 1);
    } else {
      this.#viewMonth.update((m) => m + 1);
    }
  }

  selectDay(cell: CalendarDayCell): void {
    if (cell.isDisabled || this.disabled()) return;
    this.value.set(cell.date);
    this.dateSelect.emit(cell.date);
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
      isSelected: !!selected && isSameDay(date, selected),
      isDisabled: (!!minT && t < minT) || (!!maxT && t > maxT),
    };
  }
}
