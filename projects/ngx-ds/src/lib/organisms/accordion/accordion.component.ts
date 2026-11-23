import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  input,
  untracked,
} from '@angular/core';
import {
  AccordionItemComponent,
  AccordionVariant,
  AccordionSize,
} from './accordion-item.component';
import { AccordionController, ACCORDION_CONTROLLER } from './accordion.token';

@Component({
  selector: 'ngx-ds-accordion',
  standalone: true,
  imports: [],
  template: '<ng-content />',
  styleUrl: './accordion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()' },
  providers: [{ provide: ACCORDION_CONTROLLER, useExisting: AccordionComponent }],
})
export class AccordionComponent implements AccordionController {
  readonly items = contentChildren(AccordionItemComponent);
  readonly multiple = input<boolean>(false);
  readonly variant = input<AccordionVariant>('default');
  readonly size = input<AccordionSize>('md');

  protected hostClass(): string {
    return `accordion accordion--${this.variant()}`;
  }

  constructor() {
    effect(() => {
      const variant = this.variant();
      const size = this.size();
      this.items().forEach((it) => {
        it.setVariant(variant);
        it.setSize(size);
      });
    });

    // Leaving multiple mode keeps only the first open item.
    effect(() => {
      if (this.multiple()) return;
      const items = this.items();
      untracked(() => {
        const first = items.find((it) => it._open());
        if (first) this.itemOpened(first);
      });
    });
  }

  // Called by an item when it opens — close siblings if single mode
  itemOpened(item: unknown): void {
    if (!this.multiple()) {
      this.items().forEach((it) => {
        if (it !== item) it.setOpen(false);
      });
    }
  }
}
