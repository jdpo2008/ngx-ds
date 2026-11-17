import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { LucideIconData } from 'lucide-angular';

@Component({
  selector: 'ngx-ds-step',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styles: [':host { display: block; } :host([hidden]) { display: none !important; }'],
  host: {
    '[attr.hidden]': '!_active() || null',
  },
})
export class StepComponent {
  readonly label = input.required<string>();
  readonly description = input<string>('');
  readonly icon = input<LucideIconData | undefined>(undefined);
  readonly error = input<boolean>(false);

  readonly _active = signal(false);

  setActive(v: boolean): void {
    this._active.set(v);
  }
}
