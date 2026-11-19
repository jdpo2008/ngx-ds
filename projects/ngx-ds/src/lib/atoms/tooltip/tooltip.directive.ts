import {
  ApplicationRef,
  ComponentRef,
  Directive,
  ElementRef,
  EnvironmentInjector,
  OnDestroy,
  createComponent,
  inject,
  input,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TooltipBoxComponent } from './tooltip-box.component';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

@Directive({
  selector: '[ngxTooltip]',
  standalone: true,
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
    '(focusin)': 'show()',
    '(focusout)': 'hide()',
  },
})
export class TooltipDirective implements OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly appRef = inject(ApplicationRef);
  private readonly envInjector = inject(EnvironmentInjector);
  private readonly doc = inject(DOCUMENT);

  readonly ngxTooltip = input<string>('');
  readonly tooltipPlacement = input<TooltipPlacement>('top');
  readonly tooltipDisabled = input<boolean>(false);
  readonly tooltipDelay = input<number>(200);

  private compRef: ComponentRef<TooltipBoxComponent> | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;

  show(): void {
    if (!this.ngxTooltip() || this.tooltipDisabled()) return;
    // Hover and focus can both fire: never stack a second tooltip on the first.
    if (this.timer || this.compRef) return;
    this.timer = setTimeout(() => {
      this.timer = null;
      this._create();
    }, this.tooltipDelay());
  }

  hide(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this._destroy();
  }

  ngOnDestroy(): void {
    this.hide();
  }

  private _create(): void {
    this.compRef = createComponent(TooltipBoxComponent, { environmentInjector: this.envInjector });
    this.compRef.instance.content.set(this.ngxTooltip());
    this.appRef.attachView(this.compRef.hostView);
    this.doc.body.appendChild(this.compRef.location.nativeElement);

    requestAnimationFrame(() => {
      if (!this.compRef) return;

      const hostRect = this.el.nativeElement.getBoundingClientRect();
      const tipEl = this.compRef.location.nativeElement.querySelector(
        '.ngx-tooltip',
      ) as HTMLElement;
      const tipRect = tipEl.getBoundingClientRect();
      const gap = 8;
      const vw = this.doc.documentElement.clientWidth;
      const vh = this.doc.documentElement.clientHeight;

      let top: number, left: number;

      switch (this.tooltipPlacement()) {
        case 'bottom':
          top = hostRect.bottom + gap;
          left = hostRect.left + hostRect.width / 2 - tipRect.width / 2;
          break;
        case 'left':
          top = hostRect.top + hostRect.height / 2 - tipRect.height / 2;
          left = hostRect.left - tipRect.width - gap;
          break;
        case 'right':
          top = hostRect.top + hostRect.height / 2 - tipRect.height / 2;
          left = hostRect.right + gap;
          break;
        default: // top
          top = hostRect.top - tipRect.height - gap;
          left = hostRect.left + hostRect.width / 2 - tipRect.width / 2;
      }

      // Clamp inside viewport
      tipEl.style.left = `${Math.max(8, Math.min(left, vw - tipRect.width - 8))}px`;
      tipEl.style.top = `${Math.max(8, Math.min(top, vh - tipRect.height - 8))}px`;

      this.compRef.instance.visible.set(true);
      this.compRef.changeDetectorRef.markForCheck();
    });
  }

  private _destroy(): void {
    if (!this.compRef) return;
    this.appRef.detachView(this.compRef.hostView);
    this.compRef.destroy();
    this.compRef = null;
  }
}
