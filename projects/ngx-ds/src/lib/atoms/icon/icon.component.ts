import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

export type { LucideIconData } from 'lucide-angular';

@Component({
  selector: 'ngx-ds-icon',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <lucide-angular
      [img]="icon()"
      [size]="size()"
      [color]="color()"
      [strokeWidth]="strokeWidth()"
      [absoluteStrokeWidth]="absoluteStrokeWidth()"
    />
  `,
  styles: [':host { display: inline-flex; align-items: center; justify-content: center; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Decorative unless labelled: a label makes the icon a named image.
  host: {
    '[attr.role]': "label() ? 'img' : null",
    '[attr.aria-label]': 'label() || null',
    '[attr.aria-hidden]': "label() ? null : 'true'",
  },
})
export class IconComponent {
  readonly icon = input.required<LucideIconData>();
  readonly size = input<number>(24);
  readonly color = input<string>('currentColor');
  readonly strokeWidth = input<number>(2);
  readonly absoluteStrokeWidth = input<boolean>(false);
  /** Accessible name for an icon that carries meaning on its own. */
  readonly label = input<string>('');
}
