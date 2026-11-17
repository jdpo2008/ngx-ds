import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  contentChildren,
  input,
  computed,
  effect,
} from '@angular/core';
import { AvatarComponent, AvatarSize } from '../../atoms/avatar';

@Component({
  selector: 'ngx-ds-avatar-group',
  standalone: true,
  imports: [],
  templateUrl: './avatar-group.component.html',
  styleUrl: './avatar-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarGroupComponent {
  readonly max = input<number | null>(null);
  readonly size = input<AvatarSize>('md');
  readonly spacing = input<string>('-0.5rem');

  private readonly avatarRefs = contentChildren(AvatarComponent, { read: ElementRef });

  readonly hiddenCount = computed(() => {
    const max = this.max();
    const total = this.avatarRefs().length;
    return max != null && total > max ? total - max : 0;
  });

  readonly hostStyle = computed(() => ({ '--ag-overlap': this.spacing() }));

  constructor() {
    effect(() => {
      const max = this.max();
      const refs = this.avatarRefs();
      refs.forEach((ref, i) => {
        const el = ref.nativeElement as HTMLElement;
        if (max != null && i >= max) {
          el.setAttribute('hidden', '');
        } else {
          el.removeAttribute('hidden');
        }
      });
    });
  }
}
