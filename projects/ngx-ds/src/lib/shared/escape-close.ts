import { DestroyRef, Renderer2, Signal, inject } from '@angular/core';
import { setupEscapeLayer } from './overlay-stack';

/**
 * Escucha `keydown.escape` en `document` e invoca el callback.
 * Debe llamarse en contexto de inyección (constructor).
 *
 * Con `open`, el componente se registra como capa de Escape mientras esté abierto: un modal
 * o drawer que lo contenga deja ese Escape para él, y el callback no se llama mientras haya
 * otra capa abierta encima (un Select abierto dentro de un Popover cierra solo el Select).
 */
export function setupEscapeClose(
  onEscape: (event: KeyboardEvent) => void,
  open?: Signal<boolean>,
): void {
  const renderer = inject(Renderer2);
  const destroyRef = inject(DestroyRef);
  const layer = open ? setupEscapeLayer(open) : null;

  const unlisten = renderer.listen('document', 'keydown.escape', (event: KeyboardEvent) => {
    if (layer?.isCovered()) return;
    onEscape(event);
  });

  destroyRef.onDestroy(unlisten);
}
