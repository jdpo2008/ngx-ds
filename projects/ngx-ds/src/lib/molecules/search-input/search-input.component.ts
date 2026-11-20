import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  output,
  signal,
  computed,
  inject,
  viewChild,
  ElementRef,
} from '@angular/core';
import { Search, X } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { SpinnerComponent } from '../../atoms/spinner/spinner.component';
import { Size } from '../../shared/size';
import { NGX_DS_LABELS } from '../../shared/labels';

export type SearchSize = Size;

const ICON_SIZE: Record<SearchSize, number> = { sm: 14, md: 16, lg: 18 };

@Component({
  selector: 'ngx-ds-search-input',
  standalone: true,
  imports: [IconComponent, SpinnerComponent],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent {
  readonly i18n = inject(NGX_DS_LABELS);

  readonly value = model<string>('');
  readonly placeholder = input<string | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly size = input<SearchSize>('md');
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly clearable = input<boolean>(true);

  /** Emits the current query when the user presses Enter. */
  readonly searchSubmit = output<string>();
  readonly cleared = output<void>();

  private readonly field = viewChild.required<ElementRef<HTMLInputElement>>('field');

  protected readonly focused = signal(false);
  protected readonly searchIcon = Search;
  protected readonly clearIcon = X;

  protected readonly iconSize = computed(() => ICON_SIZE[this.size()]);

  protected readonly showClear = computed(
    () => this.clearable() && this.value().length > 0 && !this.disabled() && !this.loading(),
  );

  protected readonly wrapperClasses = computed(() => {
    const b = 'search-input';
    return [
      b,
      `${b}--${this.size()}`,
      this.focused() ? `${b}--focused` : '',
      this.disabled() ? `${b}--disabled` : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }

  protected onKeydown(event: KeyboardEvent): void {
    // Enter that confirms an IME composition is not a search.
    if (event.key !== 'Enter' || event.isComposing) return;
    this.searchSubmit.emit(this.value());
  }

  protected clear(): void {
    this.value.set('');
    this.cleared.emit();
    // The clear button disappears with the text: keep focus in the field.
    this.field().nativeElement.focus();
  }
}
