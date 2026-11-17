import { AfterViewInit, Directive, ElementRef, OnDestroy, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Atrapa el foco dentro del elemento host mientras esté en el DOM.
 * Al inicializarse enfoca `[autofocus]`, el primer focusable o el propio host
 * (que debe llevar `tabindex="-1"`); al destruirse restaura el foco previo.
 */
@Directive({
  selector: '[ngxFocusTrap]',
  standalone: true,
  host: { '(keydown)': 'onKeydown($event)' },
})
export class FocusTrapDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly doc = inject(DOCUMENT);

  private previouslyFocused: HTMLElement | null = null;

  ngAfterViewInit(): void {
    this.previouslyFocused = this.doc.activeElement as HTMLElement | null;
    const host = this.el.nativeElement as HTMLElement;
    const target = host.querySelector<HTMLElement>('[autofocus]') ?? this.focusables()[0] ?? host;
    target.focus();
  }

  ngOnDestroy(): void {
    if (this.previouslyFocused?.isConnected) {
      this.previouslyFocused.focus();
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;

    const focusables = this.focusables();
    if (focusables.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = this.doc.activeElement;

    if (event.shiftKey && (active === first || active === this.el.nativeElement)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  // Se recalcula en cada Tab para cubrir contenido dinámico sin MutationObserver
  private focusables(): HTMLElement[] {
    return Array.from(
      (this.el.nativeElement as HTMLElement).querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    );
  }
}
