import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Size } from '../../shared/size';

export type KbdSize = Size;

@Component({
  selector: 'ngx-ds-kbd',
  standalone: true,
  imports: [],
  template: `<kbd [class]="hostClasses()"><ng-content /></kbd>`,
  styleUrl: './kbd.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KbdComponent {
  readonly size = input<KbdSize>('md');

  readonly hostClasses = computed(() => `kbd kbd--${this.size()}`);
}
