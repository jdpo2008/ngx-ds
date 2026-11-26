import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconInput } from '../../atoms/icon/icon.types';
import { IconComponent } from '../../atoms/icon/icon.component';
import { Size } from '../../shared/size';

export type EmptyStateSize = Size;

const ICON_SIZES: Record<EmptyStateSize, number> = { sm: 32, md: 48, lg: 64 };

@Component({
  selector: 'ngx-ds-empty-state',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  readonly icon = input<IconInput | null>(null);
  readonly title = input<string>('');
  readonly description = input<string>('');
  readonly size = input<EmptyStateSize>('md');

  readonly iconSize = computed(() => ICON_SIZES[this.size()]);
  readonly hostClasses = computed(() => `empty-state empty-state--${this.size()}`);
}
