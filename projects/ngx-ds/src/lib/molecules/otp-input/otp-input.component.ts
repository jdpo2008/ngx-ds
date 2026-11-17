import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  output,
  signal,
  computed,
  ElementRef,
  viewChildren,
  effect,
} from '@angular/core';
import { Size } from '../../shared/size';

export type OtpType = 'numeric' | 'alphanumeric';
export type OtpSize = Size;

const BOX_DIM: Record<OtpSize, string> = { sm: '2rem', md: '2.75rem', lg: '3.25rem' };
const BOX_FS: Record<OtpSize, string> = { sm: '0.875rem', md: '1rem', lg: '1.25rem' };

@Component({
  selector: 'ngx-ds-otp-input',
  standalone: true,
  imports: [],
  templateUrl: './otp-input.component.html',
  styleUrl: './otp-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpInputComponent {
  readonly length = input<number>(6);
  readonly type = input<OtpType>('numeric');
  readonly size = input<OtpSize>('md');
  readonly disabled = input<boolean>(false);
  readonly masked = input<boolean>(false);
  readonly error = input<boolean>(false);

  readonly value = model<string>('');
  readonly complete = output<string>();

  protected readonly digits = signal<string[]>([]);
  protected readonly boxes = viewChildren<ElementRef<HTMLInputElement>>('otpBox');

  protected readonly indices = computed(() => Array.from({ length: this.length() }, (_, i) => i));
  protected readonly boxDim = computed(() => BOX_DIM[this.size()]);
  protected readonly boxFs = computed(() => BOX_FS[this.size()]);
  protected readonly inputType = computed(() => (this.masked() ? 'password' : 'text'));
  protected readonly inputMode = computed(() => (this.type() === 'numeric' ? 'numeric' : 'text'));

  protected readonly wrapperClasses = computed(() => {
    const b = 'otp';
    return [b, this.disabled() ? `${b}--disabled` : ''].filter(Boolean).join(' ');
  });

  protected readonly boxClasses = computed(() => {
    const b = 'otp__box';
    return [
      b,
      `${b}--${this.size()}`,
      this.error() ? `${b}--error` : '',
      this.disabled() ? `${b}--disabled` : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  constructor() {
    effect(
      () => {
        const len = this.length();
        const cur = this.digits();
        if (cur.length !== len) {
          this.digits.set(Array.from({ length: len }, (_, i) => cur[i] ?? ''));
        }
      },
      { allowSignalWrites: true },
    );
  }

  protected onInput(event: Event, index: number): void {
    const el = event.target as HTMLInputElement;
    let raw = el.value;

    raw = this.type() === 'numeric' ? raw.replace(/\D/g, '') : raw.replace(/[^a-zA-Z0-9]/g, '');

    const char = raw.slice(-1).toUpperCase();
    el.value = char;

    const digits = [...this.digits()];
    digits[index] = char;
    this.digits.set(digits);
    this._sync(digits);

    if (char && index < this.length() - 1) {
      this.boxes()[index + 1].nativeElement.focus();
    }
  }

  protected onKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace') {
      const digits = [...this.digits()];
      if (digits[index]) {
        digits[index] = '';
        this.digits.set(digits);
        this._sync(digits);
        (event.target as HTMLInputElement).value = '';
      } else if (index > 0) {
        this.boxes()[index - 1].nativeElement.focus();
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      this.boxes()[index - 1].nativeElement.focus();
    } else if (event.key === 'ArrowRight' && index < this.length() - 1) {
      this.boxes()[index + 1].nativeElement.focus();
    }
  }

  protected onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    let text = event.clipboardData?.getData('text') ?? '';

    text = this.type() === 'numeric' ? text.replace(/\D/g, '') : text.replace(/[^a-zA-Z0-9]/g, '');

    const digits = Array.from({ length: this.length() }, (_, i) => (text[i] ?? '').toUpperCase());
    this.digits.set(digits);
    this._sync(digits);

    const boxes = this.boxes();
    digits.forEach((ch, i) => {
      boxes[i].nativeElement.value = ch;
    });
    boxes[Math.min(text.length, this.length() - 1)].nativeElement.focus();
  }

  protected onFocus(event: FocusEvent): void {
    (event.target as HTMLInputElement).select();
  }

  private _sync(digits: string[]): void {
    const joined = digits.join('');
    this.value.set(joined);
    if (joined.length === this.length() && !digits.includes('')) {
      this.complete.emit(joined);
    }
  }
}
