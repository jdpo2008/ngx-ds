import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'ngx-ds-button-group',
  standalone: true,
  imports: [],
  templateUrl: './button-group.component.html',
  styleUrl: './button-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonGroupComponent {
  readonly ariaLabel = input<string>('');
  readonly fullWidth = input<boolean>(false);

  readonly hostClasses = computed(() => {
    const classes = ['btn-group'];
    if (this.fullWidth()) classes.push('btn-group--full-width');
    return classes.join(' ');
  });
}
