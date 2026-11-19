import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Check, Copy } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { NGX_DS_LABELS } from '../../shared/labels';
import { Size } from '../../shared/size';

export interface DescriptionItem {
  label: string;
  value: string | number | null | undefined;
  /** Shows a button that copies the value to the clipboard. */
  copyable?: boolean;
  /** Spans every column when `columns` is greater than 1. */
  fullWidth?: boolean;
}

export type DescriptionListLayout = 'horizontal' | 'vertical';
export type DescriptionListSize = Size;

const COPIED_MS = 2000;

/** Label/value pairs for detail views, rendered as a semantic `<dl>`. */
@Component({
  selector: 'ngx-ds-description-list',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './description-list.component.html',
  styleUrl: './description-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescriptionListComponent {
  readonly items = input.required<DescriptionItem[]>();
  /** `horizontal`: label and value side by side. `vertical`: label above the value. */
  readonly layout = input<DescriptionListLayout>('horizontal');
  /** Number of columns on wide screens; it collapses to one on narrow ones. */
  readonly columns = input<number>(1);
  readonly size = input<DescriptionListSize>('md');
  /** Draws a line between items. */
  readonly divided = input<boolean>(true);
  /** Shown when a value is empty, `null` or `undefined`. */
  readonly emptyValue = input<string>('—');

  /** Emits the item whose value was copied. */
  readonly copied = output<DescriptionItem>();

  readonly i18n = inject(NGX_DS_LABELS);
  readonly copyIcon = Copy;
  readonly checkIcon = Check;

  readonly #copiedIndex = signal<number | null>(null);
  readonly copiedIndex = this.#copiedIndex.asReadonly();
  #timer: ReturnType<typeof setTimeout> | undefined;

  readonly classes = computed(() =>
    [
      'dl',
      `dl--${this.layout()}`,
      `dl--${this.size()}`,
      this.divided() ? 'dl--divided' : '',
      this.columns() > 1 ? 'dl--grid' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.#timer));
  }

  isEmpty(item: DescriptionItem): boolean {
    return item.value === null || item.value === undefined || item.value === '';
  }

  async copy(item: DescriptionItem, index: number): Promise<void> {
    try {
      await navigator.clipboard.writeText(String(item.value));
    } catch {
      // Clipboard denied or unavailable: no "copied" feedback.
      return;
    }
    this.#copiedIndex.set(index);
    this.copied.emit(item);
    clearTimeout(this.#timer);
    this.#timer = setTimeout(() => this.#copiedIndex.set(null), COPIED_MS);
  }
}
