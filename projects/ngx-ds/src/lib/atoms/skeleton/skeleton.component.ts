import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type SkeletonVariant = 'rect' | 'circle' | 'text';

@Component({
  selector: 'ngx-ds-skeleton',
  standalone: true,
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonComponent {
  readonly variant = input<SkeletonVariant>('rect');
  readonly width = input<string>('100%');
  readonly height = input<string>('1rem');
  readonly lines = input<number>(1);
  readonly animated = input<boolean>(true);

  protected readonly lineIndices = computed(() =>
    Array.from({ length: Math.max(1, this.lines()) }, (_, i) => i),
  );

  protected readonly baseClass = computed(() => {
    const b = 'skeleton';
    return [b, `${b}--${this.variant()}`, this.animated() ? `${b}--animated` : '']
      .filter(Boolean)
      .join(' ');
  });

  protected lineWidth(isLast: boolean): string {
    // Last line of a multi-line text block is shorter for visual realism
    if (this.variant() === 'text' && isLast && this.lines() > 1) return '65%';
    return this.width();
  }

  protected lineHeight(): string {
    return this.variant() === 'text' ? '0.875rem' : this.height();
  }
}
