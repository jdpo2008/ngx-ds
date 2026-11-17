import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { Size } from '../../shared/size';

export type BadgeSize = Size;
export type BadgeColor = 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
export type BadgeVariant = 'solid' | 'soft' | 'outline';

@Component({
  selector: 'ngx-ds-badge',
  standalone: true,
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  readonly label = input<string>('');
  readonly count = input<number | undefined>(undefined);
  readonly max = input<number>(99);
  readonly dot = input<boolean>(false);
  readonly size = input<BadgeSize>('md');
  readonly color = input<BadgeColor>('primary');
  readonly variant = input<BadgeVariant>('solid');
  readonly rounded = input<boolean>(true);

  readonly displayText = computed(() => {
    if (this.dot()) return '';
    const c = this.count();
    if (c !== undefined) return c > this.max() ? `${this.max()}+` : `${c}`;
    return this.label();
  });

  readonly hostClasses = computed(() => {
    const base = 'badge';
    const parts = [
      base,
      `${base}--${this.size()}`,
      `${base}--${this.color()}`,
      `${base}--${this.variant()}`,
    ];
    if (this.rounded()) parts.push(`${base}--rounded`);
    if (this.dot()) parts.push(`${base}--dot`);
    return parts.join(' ');
  });
}
