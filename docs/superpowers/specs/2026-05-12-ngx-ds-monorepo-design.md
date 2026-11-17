# ngx-ds Monorepo — Design Spec

**Date:** 2026-05-12
**Status:** Approved

---

## Context

Monorepo Angular para un design system llamado `ngx-ds`. El workspace raíz es la carpeta actual (`DS-Projects`). La librería se publicará progresivamente a medida que se añadan componentes. Los casos de uso son apps Angular independientes que sirven como sandbox para validar y mostrar cada componente.

---

## Decisions

| Decisión | Elección |
|---|---|
| Herramienta de monorepo | Angular CLI nativo (sin Nx) |
| Angular CLI version | 21.x |
| Estilos | SCSS |
| CSS framework | TailwindCSS v3 |
| Estilo de componentes | Standalone (Angular 17+) |
| Organización de la librería | Por tipo (`components/`, `directives/`, `pipes/`) |
| Casos de uso | Una app Angular independiente por caso de uso |
| Consumo de estilos | La librería exporta `styles/index.scss`; las apps lo importan |

---

## Architecture

### Estructura de carpetas

```
DS-Projects/                             ← raíz del workspace Angular CLI
│
├── projects/
│   │
│   ├── ngx-ds/                          ← Angular Library (design system)
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── components/          ← componentes standalone (Button, Input, Card…)
│   │   │   │   ├── directives/          ← directivas
│   │   │   │   └── pipes/               ← pipes
│   │   │   └── public-api.ts            ← barrel de exports públicos
│   │   ├── styles/
│   │   │   └── index.scss               ← entry point de estilos del DS
│   │   ├── ng-package.json
│   │   ├── package.json
│   │   └── tsconfig.lib.json
│   │
│   └── use-cases/                       ← apps de sandbox por componente
│       └── <nombre>/                    ← una carpeta por caso de uso
│           ├── src/
│           │   ├── app/
│           │   │   ├── app.component.ts
│           │   │   ├── app.component.html
│           │   │   ├── app.component.scss
│           │   │   └── app.config.ts
│           │   ├── main.ts
│           │   └── styles.scss          ← importa ngx-ds/styles/index.scss
│           ├── index.html
│           └── tsconfig.app.json
│
├── docs/
│   ├── HOW-TO-ADD-USE-CASE.md           ← guía para crear nuevas apps de caso de uso
│   └── superpowers/specs/               ← specs de diseño
│
├── tailwind.config.js                   ← config Tailwind raíz
├── postcss.config.js
├── angular.json                         ← registra la librería y todas las apps
├── package.json
└── tsconfig.json                        ← extends base, TS paths para imports de la librería
```

---

## TailwindCSS & Styles

### `tailwind.config.js`

```js
module.exports = {
  content: [
    './projects/**/*.{html,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

El `content` cubre toda la carpeta `projects/` para que Tailwind purgue correctamente tanto la librería como las apps de casos de uso.

### `projects/ngx-ds/styles/index.scss`

```scss
@tailwind base;
@tailwind components;
@tailwind utilities;

// tokens CSS del DS (se añaden a medida que crecen los componentes)
:root {
  // colores, tipografía, espaciado…
}
```

### Consumo en apps de casos de uso

Cada app importa los estilos en su `styles.scss` usando el path alias configurado en `tsconfig.json`:

```scss
@use 'ngx-ds/styles/index' as *;
```

El alias funciona porque en `angular.json` se configura `stylePreprocessorOptions.includePaths: ["projects"]` para cada app de casos de uso. Con `projects/` como base, SCSS resuelve `ngx-ds/styles/index` → `projects/ngx-ds/styles/index.scss`.

---

## Angular Library (`ngx-ds`)

- Componentes **standalone** (`standalone: true`)
- Sin NgModule
- Cada componente se exporta individualmente desde `public-api.ts`
- Estructura de un componente:

```
components/
  button/
    button.component.ts
    button.component.html
    button.component.scss
    button.component.spec.ts
    index.ts            ← barrel del componente
```

---

## Use Cases — Flujo de creación

Documentado en `docs/HOW-TO-ADD-USE-CASE.md`. El proceso tiene 4 pasos:

1. Crear la carpeta `projects/use-cases/<nombre>/` con la estructura mínima de archivos.
2. Registrar la app en `angular.json`.
3. Ajustar `tsconfig.app.json` del caso de uso para extender del root.
4. Importar `ngx-ds` y sus estilos.

Cada app se sirve con `ng serve --project=use-case-<nombre>` y se compila con `ng build --project=use-case-<nombre>`.

---

## Constraints

- No se usa `ng generate application` para los casos de uso porque Angular CLI no genera en subdirectorios anidados. La creación se hace manualmente siguiendo la guía.
- Las apps de casos de uso **no se publican**; son exclusivamente para desarrollo y validación local.
- La librería `ngx-ds` sí está pensada para publicarse en npm a futuro (estructura `ng-package.json` compatible).

---

## Out of Scope

- Storybook
- Testing e2e
- CI/CD pipeline
- Publicación en npm (por ahora)
