import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  inject,
  linkedSignal,
} from '@angular/core';
import { NGX_DS_LABELS } from '../../shared/labels';

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
  readonly i18n = inject(NGX_DS_LABELS);

  readonly src = input<string | undefined>(undefined);
  readonly alt = input<string>('');
  readonly initials = input<string>('');
  readonly size = input<AvatarSize>('md');
  readonly shape = input<AvatarShape>('circle');
  readonly status = input<AvatarStatus | undefined>(undefined);
  readonly color = input<AvatarColor>('neutral');
  readonly bordered = input<boolean>(false);

  /** True once the current src failed to load; a new src tries again. */
  readonly #imageFailed = linkedSignal({ source: this.src, computation: () => false });

  /** The image to show, or undefined to show the initials. */
  readonly imageSrc = computed(() => (this.#imageFailed() ? undefined : this.src()));

  readonly statusText = computed(() => {
    const status = this.status();
    return status ? this.i18n.avatarStatus[status] : '';
  });

  readonly hostClasses = computed(() => {
    const classes = ['avatar', `avatar--${this.size()}`, `avatar--${this.shape()}`];
    if (!this.imageSrc()) classes.push(`avatar--${this.color()}`);
    if (this.bordered()) classes.push('avatar--bordered');
    return classes.join(' ');
  });

  onImageError(): void {
    this.#imageFailed.set(true);
  }

  readonly displayInitials = computed(() => this.initials().slice(0, 2).toUpperCase());
}
