import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type CardShadow = 'none' | 'sm' | 'md' | 'lg';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'ngx-ds-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  readonly shadow = input<CardShadow>('sm');
  readonly padding = input<CardPadding>('md');
  readonly bordered = input<boolean>(true);
  readonly hoverable = input<boolean>(false);

  readonly hostClasses = computed(() => {
    const b = 'card';
    return [
      b,
      `${b}--shadow-${this.shadow()}`,
      `${b}--pad-${this.padding()}`,
      this.bordered() ? `${b}--bordered` : '',
      this.hoverable() ? `${b}--hoverable` : '',
    ]
      .filter(Boolean)
      .join(' ');
  });
}
