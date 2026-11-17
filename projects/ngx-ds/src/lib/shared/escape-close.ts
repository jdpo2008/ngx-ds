import { DestroyRef, Renderer2, inject } from '@angular/core';

/**
 * Escucha `keydown.escape` en `document` e invoca el callback.
 * Debe llamarse en contexto de inyección (constructor).
 */
export function setupEscapeClose(onEscape: (event: KeyboardEvent) => void): void {
  const renderer = inject(Renderer2);
  const destroyRef = inject(DestroyRef);

  const unlisten = renderer.listen('document', 'keydown.escape', (event: KeyboardEvent) => {
    onEscape(event);
  });

  destroyRef.onDestroy(unlisten);
}
