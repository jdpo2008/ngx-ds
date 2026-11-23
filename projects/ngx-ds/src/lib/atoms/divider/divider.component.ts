import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';
export type DividerAlign = 'start' | 'center' | 'end';

@Component({
  selector: 'ngx-ds-divider',
  standalone: true,
  imports: [],
  templateUrl: './divider.component.html',
  styleUrl: './divider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerComponent {
  readonly orientation = input<DividerOrientation>('horizontal');
  readonly variant = input<DividerVariant>('solid');
  readonly label = input<string>('');
  readonly align = input<DividerAlign>('center');
  readonly color = input<string>('');

  /** Only a horizontal divider shows its label. */
  readonly shownLabel = computed(() => (this.orientation() === 'horizontal' ? this.label() : ''));

  readonly hostClasses = computed(() => {
    const b = 'divider';
    return [
      b,
      `${b}--${this.orientation()}`,
      `${b}--${this.variant()}`,
      this.shownLabel() ? `${b}--labeled ${b}--label-${this.align()}` : '',
    ]
      .filter(Boolean)
      .join(' ');
  });
}
