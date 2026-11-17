import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  input,
} from '@angular/core';
import { TimelineItemComponent } from './timeline-item.component';

export type TimelineVariant = 'default' | 'compact';

@Component({
  selector: 'ngx-ds-timeline',
  standalone: true,
  imports: [],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent {
  readonly variant = input<TimelineVariant>('default');

  readonly items = contentChildren(TimelineItemComponent);

  readonly hostClasses = computed(() => `timeline timeline--${this.variant()}`);
}
