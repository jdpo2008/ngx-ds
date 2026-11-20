import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideIconData } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';

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
  readonly title = input<string>('');
  readonly description = input<string>('');
  readonly time = input<string>('');
  readonly status = input<TimelineItemStatus>('pending');
  readonly icon = input<LucideIconData | null>(null);

  readonly dotClasses = computed(() => `timeline-item__dot timeline-item__dot--${this.status()}`);
}
