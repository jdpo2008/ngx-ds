import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  forwardRef,
  inject,
  input,
  linkedSignal,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Clock, X } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { setupClickOutside } from '../../shared/click-outside';
import { setupEscapeClose } from '../../shared/escape-close';
import { FieldErrors, fieldErrorText, fieldHasError } from '../../shared/field-error';
import { isActivationKey } from '../../shared/keyboard';
import { NGX_DS_LABELS } from '../../shared/labels';
import { Size } from '../../shared/size';

export type TimePickerSize = Size;
export type TimePickerHourFormat = '12' | '24';

/** One entry of the hour, minute or AM/PM column. */
export interface TimeOption {
  value: number;
  label: string;
  disabled: boolean;
  selected: boolean;
}

const ICON_SIZE: Record<TimePickerSize, number> = { sm: 14, md: 16, lg: 18 };
const LAST_MINUTE = 23 * 60 + 59;

const pad = (n: number): string => String(n).padStart(2, '0');

/** Parses `HH:mm` into minutes since midnight, or `null` when it is not a valid time. */
export function parseTime(value: string | null | undefined): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value?.trim() ?? '');
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  return h > 23 || m > 59 ? null : h * 60 + m;
}

function formatTime(total: number): string {
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

let nextId = 0;

/**
 * Time field with an hour / minute (and AM/PM) panel.
 * The value is a 24-hour `HH:mm` string, like a native `<input type="time">`.
 */
@Component({
  selector: 'ngx-ds-time-picker',
  standalone: true,
  imports: [IconComponent, NgTemplateOutlet],
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true,
    },
  ],
})
export class TimePickerComponent implements ControlValueAccessor {
  readonly i18n = inject(NGX_DS_LABELS);

  // ── Configuration ─────────────────────────────────────────
  readonly label = input<string>('');
  readonly floatingLabel = input<boolean>(false);
  readonly placeholder = input<string | undefined>(undefined);
  readonly size = input<TimePickerSize>('md');
  readonly hint = input<string>('');
  readonly errorMessage = input<string>('');
  /** Set by Signal Forms `[formField]`. Its errors show once the field is touched. */
  readonly errors = input<FieldErrors>([]);
  readonly touched = input<boolean>(false);
  /** `'24'` shows 00–23; `'12'` shows 1–12 plus an AM/PM column. The value is always 24-hour. */
  readonly hourFormat = input<TimePickerHourFormat>('24');
  /** Gap between the minutes offered in the panel. */
  readonly minuteStep = input<number>(5);
  /** Earliest selectable time, as `HH:mm`. */
  readonly minTime = input<string | null>(null);
  /** Latest selectable time, as `HH:mm`. */
  readonly maxTime = input<string | null>(null);

  // ── Value ────────────────────────────────────────────────
  /** Selected time as `HH:mm` (24-hour), or `null`. */
  readonly value = model<string | null>(null);

  readonly id = `ngx-time-picker-${nextId++}`;
  readonly messageId = `${this.id}-message`;

  readonly ClockIcon = Clock;
  readonly XIcon = X;

  // ── Internal state ────────────────────────────────────────
  readonly #open = signal(false);
  readonly #focused = signal(false);
  readonly #disabled = signal(false);
  readonly #injector = inject(Injector);

  readonly isOpen = this.#open.asReadonly();
  readonly isDisabled = this.#disabled.asReadonly();
  readonly isFocused = this.#focused.asReadonly();

  readonly #total = computed(() => parseTime(this.value()));
  readonly #hour = computed(() => {
    const t = this.#total();
    return t === null ? null : Math.floor(t / 60);
  });
  readonly #minute = computed(() => {
    const t = this.#total();
    return t === null ? null : t % 60;
  });
  /** AM/PM shown in 12-hour mode; follows the value but can be picked before an hour. */
  readonly #pm = linkedSignal(() => (this.#hour() ?? 0) >= 12);

  readonly #min = computed(() => parseTime(this.minTime()) ?? 0);
  readonly #max = computed(() => parseTime(this.maxTime()) ?? LAST_MINUTE);
  readonly #minuteValues = computed(() => {
    const step = Math.min(Math.max(Math.floor(this.minuteStep()) || 1, 1), 60);
    const values: number[] = [];
    for (let m = 0; m < 60; m += step) values.push(m);
    return values;
  });

  // ── Derived ───────────────────────────────────────────────
  readonly iconSize = computed(() => ICON_SIZE[this.size()]);
  readonly is12h = computed(() => this.hourFormat() === '12');
  readonly hasError = computed(() =>
    fieldHasError(this.errorMessage(), this.errors(), this.touched()),
  );
  readonly errorText = computed(() =>
    fieldErrorText(this.errorMessage(), this.errors(), this.touched()),
  );
  readonly hasValue = computed(() => this.#total() !== null);
  readonly isFloating = computed(() => this.#focused() || this.hasValue());

  readonly displayValue = computed(() => {
    const t = this.#total();
    if (t === null) return '';
    if (!this.is12h()) return formatTime(t);
    const h = Math.floor(t / 60);
    return `${h % 12 || 12}:${pad(t % 60)} ${h >= 12 ? 'PM' : 'AM'}`;
  });

  readonly hourOptions = computed((): TimeOption[] => {
    const selected = this.#hour();
    const hours = this.is12h()
      ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h12) => ({
          value: (h12 % 12) + (this.#pm() ? 12 : 0),
          label: String(h12),
        }))
      : Array.from({ length: 24 }, (_, h) => ({ value: h, label: pad(h) }));
    return hours.map((o) => ({
      ...o,
      disabled: !this.#hourEnabled(o.value),
      selected: o.value === selected,
    }));
  });

  readonly minuteOptions = computed((): TimeOption[] => {
    const hour = this.#hour();
    const selected = this.#minute();
    return this.#minuteValues().map((m) => ({
      value: m,
      label: pad(m),
      disabled: hour !== null && !this.#allowed(hour * 60 + m),
      selected: m === selected,
    }));
  });

  readonly periodOptions = computed((): TimeOption[] => {
    const pm = this.#pm();
    const anyEnabled = (from: number) =>
      Array.from({ length: 12 }, (_, i) => from + i).some((h) => this.#hourEnabled(h));
    return [
      { value: 0, label: 'AM', disabled: !anyEnabled(0), selected: !pm },
      { value: 12, label: 'PM', disabled: !anyEnabled(12), selected: pm },
    ];
  });

  readonly fieldClasses = computed(() => {
    const base = 'ngx-time-picker__field';
    return [
      base,
      `${base}--${this.size()}`,
      this.isFocused() ? `${base}--focused` : '',
      this.hasError() ? `${base}--error` : '',
      this.isDisabled() ? `${base}--disabled` : '',
      this.floatingLabel() ? `${base}--floating` : '',
      this.hasValue() && !this.isDisabled() ? `${base}--clearable` : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  readonly floatLabelClasses = computed(() => {
    const base = 'ngx-time-picker__float-label';
    return [
      base,
      this.isFloating() ? `${base}--active` : '',
      this.isFocused() ? `${base}--focused` : '',
      this.hasError() ? `${base}--error` : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  private readonly triggerRef = viewChild<ElementRef<HTMLElement>>('trigger');
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');

  constructor() {
    setupEscapeClose(() => this.#closeOnEscape());
    setupClickOutside(() => {
      if (!this.#open() && !this.#focused()) return;
      this.#open.set(false);
      this.#focused.set(false);
      this.onTouched();
    });
  }

  /** The option of a column that Tab lands on: the selected one, else the first enabled one. */
  isFocusTarget(options: TimeOption[], option: TimeOption): boolean {
    const target =
      options.find((o) => o.selected && !o.disabled) ?? options.find((o) => !o.disabled);
    return option === target;
  }

  // ── Interactions ──────────────────────────────────────────
  togglePanel(): void {
    if (this.isDisabled()) return;
    const opening = !this.#open();
    this.#open.set(opening);
    this.#focused.set(opening);
    if (opening) {
      afterNextRender(
        () => {
          const panel = this.panelRef()?.nativeElement;
          if (!panel) return;
          // Center the selected option of each column, then focus the first column.
          panel.querySelectorAll<HTMLElement>('[role="listbox"]').forEach((list) => {
            const selected = list.querySelector<HTMLElement>('[aria-selected="true"]');
            if (selected) {
              list.scrollTop = selected.offsetTop - (list.clientHeight - selected.offsetHeight) / 2;
            }
          });
          panel
            .querySelector<HTMLElement>('[role="option"][tabindex="0"]')
            ?.focus({ preventScroll: true });
        },
        { injector: this.#injector },
      );
    }
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    // Ignore keys coming from the clear button.
    if (event.target !== event.currentTarget) return;
    if (isActivationKey(event) || (event.key === 'ArrowDown' && !this.isOpen())) {
      event.preventDefault();
      this.togglePanel();
    }
  }

  /** Arrow / Home / End move focus inside a column, skipping disabled options. */
  onOptionKeydown(event: KeyboardEvent): void {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const current = event.currentTarget as HTMLElement;
    const list = current.closest('[role="listbox"]');
    if (!list) return;
    const options = Array.from(
      list.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"])'),
    );
    const i = options.indexOf(current);
    const last = options.length - 1;
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? last
          : event.key === 'ArrowDown'
            ? Math.min(i + 1, last)
            : Math.max(i - 1, 0);
    options[next]?.focus();
  }

  select(kind: 'hour' | 'minute' | 'period', option: TimeOption): void {
    if (kind === 'hour') this.selectHour(option);
    else if (kind === 'minute') this.selectMinute(option);
    else this.selectPeriod(option);
  }

  selectHour(option: TimeOption): void {
    if (option.disabled || this.isDisabled()) return;
    const h = option.value;
    const current = this.#minute();
    const m =
      current !== null && this.#allowed(h * 60 + current)
        ? current
        : this.#minuteValues().find((v) => this.#allowed(h * 60 + v));
    if (m !== undefined) this.#commit(h * 60 + m);
  }

  selectMinute(option: TimeOption): void {
    if (option.disabled || this.isDisabled()) return;
    const h =
      this.#hour() ??
      this.hourOptions().find((o) => !o.disabled && this.#allowed(o.value * 60 + option.value))
        ?.value;
    if (h === undefined || !this.#allowed(h * 60 + option.value)) return;
    this.#commit(h * 60 + option.value);
    this.#open.set(false);
    this.#focused.set(false);
    this.triggerRef()?.nativeElement.focus();
  }

  selectPeriod(option: TimeOption): void {
    if (option.disabled || this.isDisabled()) return;
    const pm = option.value === 12;
    this.#pm.set(pm);
    const h = this.#hour();
    if (h === null || h >= 12 === pm) return;
    const target = this.hourOptions().find((o) => o.value === (h % 12) + (pm ? 12 : 0));
    if (target) this.selectHour(target);
  }

  clearValue(event: Event): void {
    event.stopPropagation();
    if (this.isDisabled()) return;
    this.value.set(null);
    this.onChange(null);
  }

  // ── Helpers ───────────────────────────────────────────────
  #allowed(total: number): boolean {
    return total >= this.#min() && total <= this.#max();
  }

  #hourEnabled(h: number): boolean {
    return this.#minuteValues().some((m) => this.#allowed(h * 60 + m));
  }

  #commit(total: number): void {
    const v = formatTime(total);
    this.value.set(v);
    this.onChange(v);
  }

  #closeOnEscape(): void {
    if (!this.isOpen()) return;
    this.#open.set(false);
    this.#focused.set(false);
    this.triggerRef()?.nativeElement.focus();
  }

  // ── CVA ───────────────────────────────────────────────────
  private onChange: (v: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: string | null): void {
    this.value.set(v ?? null);
  }
  registerOnChange(fn: (v: string | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.#disabled.set(disabled);
  }
}
