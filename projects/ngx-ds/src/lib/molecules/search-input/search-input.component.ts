import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  output,
  signal,
  computed,
} from '@angular/core';
import { Search, X } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { SpinnerComponent } from '../../atoms/spinner/spinner.component';
import { Size } from '../../shared/size';

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
  readonly value = model<string>('');
  readonly placeholder = input<string>('Buscar...');
  readonly ariaLabel = input<string>('Buscar');
  readonly size = input<SearchSize>('md');
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly clearable = input<boolean>(true);

  /** Emits the current query when the user presses Enter. */
  readonly searchSubmit = output<string>();
  /**
   * @deprecated Use `(searchSubmit)` instead. `search` clashes with the native DOM
   * `search` event. Still emitted alongside `searchSubmit`; will be removed in the
   * next major.
   */
  // eslint-disable-next-line @angular-eslint/no-output-native
  readonly search = output<string>();
  readonly cleared = output<void>();

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
    if (event.key !== 'Enter') return;
    const query = this.value();
    this.searchSubmit.emit(query);
    this.search.emit(query);
  }

  protected clear(): void {
    this.value.set('');
    this.cleared.emit();
  }
}
