# Storybook + Toast Stories — Design Spec

**Date:** 2026-05-13
**Status:** Approved

---

## Context

Monorepo Angular (DS-Projects) con la librería `ngx-ds`. Ya existe un `ToastComponent` y un `ToastrService` (signal-based, `providedIn: 'root'`). El objetivo es instalar Storybook 8 en la raíz del workspace y crear las stories para el componente Toast.

---

## Decisions

| Decisión | Elección |
|---|---|
| Instalación | `npx storybook@latest init` + ajustes post-init |
| Storybook root | `DS-Projects/` (workspace root) |
| Stories location | `projects/ngx-ds/stories/` |
| Preview styles | Importa `projects/ngx-ds/styles/index.scss` |
| Stories approach | Wrapper interactivo con botones |
| tsconfig de Storybook | `./tsconfig.json` (root) — resuelve path alias `ngx-ds` |

---

## Architecture

### Estructura de archivos nueva

```
DS-Projects/
│
├── .storybook/
│   ├── main.ts          ← config principal (stories glob, framework, addons)
│   └── preview.ts       ← estilos globales, decorators globales
│
└── projects/
    └── ngx-ds/
        └── stories/
            └── toast/
                └── toast.stories.ts
```

### `.storybook/main.ts`

```ts
import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../projects/ngx-ds/stories/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
};

export default config;
```

El glob `../projects/ngx-ds/stories/**` cubre todas las stories actuales y futuras de la librería.

### `.storybook/preview.ts`

```ts
import type { Preview } from '@storybook/angular';
import '../projects/ngx-ds/styles/index.scss';

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
  },
};

export default preview;
```

Importar `index.scss` aquí garantiza que TailwindCSS esté disponible en todas las stories.

---

## Toast Stories

### Componente Wrapper

Story-local, no se exporta a `public-api.ts`. Sirve únicamente para Storybook:

```ts
@Component({
  selector: 'toast-story-wrapper',
  standalone: true,
  imports: [ToastComponent],
  template: `
    <div class="p-6 space-y-4">
      <div class="flex flex-wrap gap-2">
        <!-- botones para disparar toasts -->
      </div>
      <app-toast />
    </div>
  `,
})
class ToastStoryWrapper {
  toastrService = inject(ToastrService);
  // métodos: showSuccess(), showError(), showWarning(), showInfo()
}
```

### Stories definidas

| Story | Descripción |
|---|---|
| `Default` | Botones para los 4 tipos. Posición por defecto: `top-right` |
| `AllTypes` | Un botón por tipo, título descriptivo en cada toast |
| `AllPositions` | Selector de posición + botón de disparo para demostrar `top-right`, `top-left`, `bottom-right`, `bottom-left` |

### Controles (args)

Las stories usan el wrapper component — no hay @Input en `ToastComponent`. Los args de Storybook sirven para documentar los valores, pero la interacción ocurre mediante los botones del wrapper.

---

## Scripts npm

Añadir al `package.json` raíz:

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

---

## Constraints

- `ToastComponent` usa selector `app-toast` (no `ngx-toast`). Las stories lo usan tal cual.
- Las stories **no se publican** con la librería. Son exclusivamente para desarrollo local.
- `storybook@latest init` puede generar stories de ejemplo en `/stories/` root — se eliminan como parte de la configuración.
- El path alias `ngx-ds` → `./projects/ngx-ds/src/public-api.ts` en `tsconfig.json` permite que las stories importen desde `ngx-ds` en lugar de rutas relativas.
- `@angular/build:ng-packagr` no es invocado por Storybook. Storybook usa el compilador Angular directamente (Ivy + esbuild interno).

---

## Out of Scope

- Stories para otros componentes (se añaden en el futuro siguiendo el mismo patrón)
- Play functions / interaction testing automático
- Compodoc / documentación automática de API
- Deploy de Storybook (Chromatic u otros)
