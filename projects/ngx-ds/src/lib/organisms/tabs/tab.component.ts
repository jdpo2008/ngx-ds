import { ChangeDetectionStrategy, Component, contentChild, input, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { IconInput } from '../../atoms/icon/icon.types';
import { TabContentDirective } from './tab-content.directive';

@Component({
  selector: 'ngx-ds-tab',
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (contentTpl(); as tpl) {
      @if (!lazy() || _activatedOnce()) {
        <ng-container [ngTemplateOutlet]="tpl.templateRef" />
      }
    } @else {
      <ng-content />
    }
  `,
  styles: [':host { display: block; } :host([hidden]) { display: none !important; }'],
  host: {
    role: 'tabpanel',
    '[attr.hidden]': '!_active() || null',
    '[attr.id]': '_id()',
    '[attr.aria-labelledby]': '_labelledBy()',
  },
})
export class TabComponent {
  readonly label = input.required<string>();
  readonly disabled = input<boolean>(false);
  readonly icon = input<IconInput | undefined>(undefined);
  readonly lazy = input<boolean>(false);

  protected readonly contentTpl = contentChild(TabContentDirective);

  readonly _active = signal(false);
  readonly _activatedOnce = signal(false);
  readonly _id = signal<string | null>(null);
  readonly _labelledBy = signal<string | null>(null);

  setActive(v: boolean): void {
    this._active.set(v);
    if (v) this._activatedOnce.set(true);
  }

  setIds(id: string, labelledBy: string): void {
    this._id.set(id);
    this._labelledBy.set(labelledBy);
  }
}
