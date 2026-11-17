import { DestroyRef, ElementRef, Renderer2, inject } from '@angular/core';

/**
 * Escucha clicks en `document` e invoca el callback cuando el click ocurre
 * fuera del elemento host. Debe llamarse en contexto de inyección (constructor).
 */
export function setupClickOutside(onClickOutside: (event: MouseEvent) => void): void {
  const el = inject(ElementRef);
  const renderer = inject(Renderer2);
  const destroyRef = inject(DestroyRef);

  const unlisten = renderer.listen('document', 'click', (event: MouseEvent) => {
    if (!el.nativeElement.contains(event.target as Node)) {
      onClickOutside(event);
    }
  });

  destroyRef.onDestroy(unlisten);
}
