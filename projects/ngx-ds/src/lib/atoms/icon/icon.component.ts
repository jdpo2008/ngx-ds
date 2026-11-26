import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';
import {
  LucideDynamicIcon,
  LucideIconData as LucideIconObject,
  isLucideIconComponent,
  isLucideIconData,
  lucideLegacyIcon,
} from '@lucide/angular';
import { IconInput } from './icon.types';

/** Turns any accepted icon shape into the `@lucide/angular` data object. */
function toLucideIcon(icon: IconInput): LucideIconObject {
  if (isLucideIconComponent(icon)) return icon.icon;
  if (isLucideIconData(icon)) return icon;
  return lucideLegacyIcon('icon', icon as unknown as LucideIconObject['node']);
}

@Component({
  selector: 'ngx-ds-icon',
  standalone: true,
  imports: [LucideDynamicIcon],
  template: `
    <svg
      [lucideIcon]="data()"
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
  readonly icon = input.required<IconInput>();
  readonly size = input<number>(24);
  readonly color = input<string>('currentColor');
  readonly strokeWidth = input<number>(2);
  readonly absoluteStrokeWidth = input<boolean>(false);
  /** Accessible name for an icon that carries meaning on its own. */
  readonly label = input<string>('');

  protected readonly data = computed(() => toLucideIcon(this.icon()));
}
