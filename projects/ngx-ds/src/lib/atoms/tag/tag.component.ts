import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { LucideIconData } from 'lucide-angular';
import { IconComponent } from '../icon/icon.component';
import { X } from 'lucide-angular';
import { Size } from '../../shared/size';

export type TagSize = Size;
export type TagColor = 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
export type TagVariant = 'solid' | 'outline' | 'soft';

const ICON_SIZE: Record<TagSize, number> = { sm: 12, md: 14, lg: 16 };

@Component({
  selector: 'ngx-ds-tag',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  readonly label = input.required<string>();
  readonly size = input<TagSize>('md');
  readonly color = input<TagColor>('primary');
  readonly variant = input<TagVariant>('soft');
  readonly iconLeft = input<LucideIconData | undefined>(undefined);
  readonly iconRight = input<LucideIconData | undefined>(undefined);
  readonly rounded = input<boolean>(true);
  readonly dismissible = input<boolean>(false);

  readonly dismissed = output<void>();

  readonly closeIcon = X;

  readonly hostClasses = computed(() => {
    const classes = [
      'tag',
      `tag--${this.variant()}`,
      `tag--${this.size()}`,
      `tag--${this.color()}`,
    ];
    if (this.rounded()) classes.push('tag--rounded');
    return classes.join(' ');
  });

  readonly iconSize = computed(() => ICON_SIZE[this.size()]);

  onDismiss(): void {
    this.dismissed.emit();
  }
}
