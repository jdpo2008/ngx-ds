import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';
export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy';
export type AvatarColor =
  'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'neutral';

@Component({
  selector: 'ngx-ds-avatar',
  standalone: true,
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  readonly src = input<string | undefined>(undefined);
  readonly alt = input<string>('');
  readonly initials = input<string>('');
  readonly size = input<AvatarSize>('md');
  readonly shape = input<AvatarShape>('circle');
  readonly status = input<AvatarStatus | undefined>(undefined);
  readonly color = input<AvatarColor>('neutral');
  readonly bordered = input<boolean>(false);

  readonly hostClasses = computed(() => {
    const classes = ['avatar', `avatar--${this.size()}`, `avatar--${this.shape()}`];
    if (!this.src()) classes.push(`avatar--${this.color()}`);
    if (this.bordered()) classes.push('avatar--bordered');
    return classes.join(' ');
  });

  readonly displayInitials = computed(() => this.initials().slice(0, 2).toUpperCase());
}
