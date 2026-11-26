import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { IconInput } from '../../atoms/icon/icon.types';
import { IconComponent } from '../../atoms/icon/icon.component';
import { NGX_DS_LABELS } from '../../shared/labels';

export type TimelineItemStatus = 'completed' | 'active' | 'pending' | 'error';

@Component({
  selector: 'ngx-ds-timeline-item',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './timeline-item.component.html',
  styleUrl: './timeline-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'listitem', '[attr.aria-current]': "status() === 'active' ? 'step' : null" },
})
export class TimelineItemComponent {
  readonly #i18n = inject(NGX_DS_LABELS);

  readonly title = input<string>('');
  readonly description = input<string>('');
  readonly time = input<string>('');
  readonly status = input<TimelineItemStatus>('pending');
  readonly icon = input<IconInput | null>(null);

  readonly dotClasses = computed(() => `timeline-item__dot timeline-item__dot--${this.status()}`);

  /** Text for statuses shown only by colour. Active uses aria-current; pending is the default. */
  readonly statusText = computed(() => {
    switch (this.status()) {
      case 'completed':
        return this.#i18n.timelineCompleted;
      case 'error':
        return this.#i18n.timelineError;
      default:
        return '';
    }
  });
}
