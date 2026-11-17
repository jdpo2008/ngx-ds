# ngx-ds Monorepo Setup — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Inicializar el monorepo Angular en `DS-Projects/` con la librería `ngx-ds`, TailwindCSS v3, SCSS, la estructura de casos de uso, y la guía de incorporación de nuevas apps.

**Architecture:** Angular CLI 21 nativo (sin Nx). La librería `ngx-ds` vive en `projects/ngx-ds/` organizada por tipo de artefacto. Los casos de uso se crean manualmente en `projects/use-cases/<nombre>/` y se registran en `angular.json`. Los estilos del DS fluyen desde `projects/ngx-ds/styles/index.scss` hacia las apps vía `@use 'ngx-ds/styles/index'`, resuelto por `stylePreprocessorOptions.includePaths: ["projects"]`.

**Tech Stack:** Angular CLI 21, TypeScript strict, SCSS, TailwindCSS v3, ng-packagr, Node 24, npm 11.

---

## Mapa de archivos

| Archivo | Acción | Responsabilidad |
|---|---|---|
| `angular.json` | Generado por `ng new`, sin modificar | Config del workspace: librería + apps futuras |
| `package.json` | Generado por `ng new`, modificado en Task 5 | Dependencias del workspace |
| `tsconfig.json` | Generado por `ng new`, modificado en Task 6 | TS strict + paths `ngx-ds → src` |
| `tailwind.config.js` | Creado en Task 5 | Content patterns para todo `projects/**` |
| `projects/ngx-ds/src/public-api.ts` | Generado + limpiado en Task 3 | Barrel de exports públicos |
| `projects/ngx-ds/src/lib/components/.gitkeep` | Creado en Task 3 | Carpeta de componentes |
| `projects/ngx-ds/src/lib/directives/.gitkeep` | Creado en Task 3 | Carpeta de directivas |
| `projects/ngx-ds/src/lib/pipes/.gitkeep` | Creado en Task 3 | Carpeta de pipes |
| `projects/ngx-ds/styles/index.scss` | Creado en Task 4 | Entry point de estilos: Tailwind + tokens |
| `projects/ngx-ds/ng-package.json` | Generado por `ng generate library` | Config ng-packagr |
| `projects/ngx-ds/tsconfig.lib.json` | Generado por `ng generate library` | TS config para la librería |
| `projects/use-cases/.gitkeep` | Creado en Task 7 | Reserva carpeta de casos de uso en git |
| `docs/HOW-TO-ADD-USE-CASE.md` | Creado en Task 8 | Guía completa para crear apps de sandbox |

---

## Task 1: Inicializar el workspace Angular en el directorio actual

**Files:**
- Crea: `angular.json`, `package.json`, `tsconfig.json`, `.editorconfig`, `.gitignore`

- [ ] **Step 1: Verificar que el directorio de trabajo es el correcto y está vacío**

```powershell
Get-Location
Get-ChildItem
```

Salida esperada: ruta termina en `DS-Projects`, directorio vacío (excepto `docs/` creado por el spec).

- [ ] **Step 2: Crear el workspace Angular en el directorio actual**

```powershell
ng new ngx-ds --create-application=false --style=scss --strict --skip-git --directory=.
```

> Si Angular CLI pregunta algo interactivo, presiona Enter para aceptar el valor por defecto.

Salida esperada:
```
CREATE angular.json (...)
CREATE package.json (...)
CREATE tsconfig.json (...)
...
✔ Packages installed successfully.
```

- [ ] **Step 3: Verificar que los archivos del workspace fueron creados**

```powershell
Test-Path angular.json
Test-Path package.json
Test-Path tsconfig.json
```

Salida esperada: `True` para los tres.

- [ ] **Step 4: Commit**

```powershell
git init
git add angular.json package.json tsconfig.json .editorconfig .gitignore .vscode
git commit -m "chore: initialize Angular workspace"
```

---

## Task 2: Generar la librería ngx-ds

**Files:**
- Crea: `projects/ngx-ds/` (estructura completa de la librería)
- Modifica: `angular.json` (agrega entrada `ngx-ds`), `tsconfig.json` (agrega path a `dist/`)

- [ ] **Step 1: Generar la librería**

```powershell
ng generate library ngx-ds --prefix=ngx
```

Salida esperada:
```
CREATE projects/ngx-ds/ng-package.json
CREATE projects/ngx-ds/package.json
CREATE projects/ngx-ds/src/public-api.ts
CREATE projects/ngx-ds/src/lib/ngx-ds.component.spec.ts
CREATE projects/ngx-ds/src/lib/ngx-ds.component.ts
CREATE projects/ngx-ds/src/lib/ngx-ds.service.spec.ts
CREATE projects/ngx-ds/src/lib/ngx-ds.service.ts
CREATE projects/ngx-ds/tsconfig.lib.json
UPDATE angular.json
UPDATE package.json
UPDATE tsconfig.json
```

> Angular CLI puede generar diferentes archivos según la versión. Lo relevante es que `projects/ngx-ds/` exista y `angular.json` la registre.

- [ ] **Step 2: Verificar que la librería fue registrada en angular.json**

```powershell
Get-Content angular.json | Select-String "ngx-ds"
```

Salida esperada: al menos una línea con `"ngx-ds"`.

- [ ] **Step 3: Verificar que el proyecto es visible para Angular CLI**

```powershell
ng version --project=ngx-ds 2>&1 | Select-String "Project"
```

O simplemente verificar:

```powershell
(Get-Content angular.json | ConvertFrom-Json).projects.PSObject.Properties.Name
```

Salida esperada: `ngx-ds` aparece en la lista.

---

## Task 3: Limpiar defaults y estructurar la librería por tipo

**Files:**
- Elimina: archivos de ejemplo generados en `projects/ngx-ds/src/lib/`
- Crea: `projects/ngx-ds/src/lib/components/.gitkeep`
- Crea: `projects/ngx-ds/src/lib/directives/.gitkeep`
- Crea: `projects/ngx-ds/src/lib/pipes/.gitkeep`
- Modifica: `projects/ngx-ds/src/public-api.ts`

- [ ] **Step 1: Ver qué archivos generó Angular CLI en la librería**

```powershell
Get-ChildItem "projects/ngx-ds/src/lib/"
```

- [ ] **Step 2: Eliminar todos los archivos de ejemplo**

```powershell
Remove-Item "projects/ngx-ds/src/lib/*" -Force -Recurse
```

- [ ] **Step 3: Crear las carpetas por tipo con .gitkeep**

```powershell
New-Item -ItemType Directory -Force "projects/ngx-ds/src/lib/components"
New-Item -ItemType Directory -Force "projects/ngx-ds/src/lib/directives"
New-Item -ItemType Directory -Force "projects/ngx-ds/src/lib/pipes"
New-Item -ItemType File "projects/ngx-ds/src/lib/components/.gitkeep"
New-Item -ItemType File "projects/ngx-ds/src/lib/directives/.gitkeep"
New-Item -ItemType File "projects/ngx-ds/src/lib/pipes/.gitkeep"
```

- [ ] **Step 4: Reemplazar public-api.ts con un barrel vacío**

Edita `projects/ngx-ds/src/public-api.ts` para que quede exactamente así:

```typescript
// Public API Surface of ngx-ds
// Export components, directives, and pipes here as they are created.
// Example: export * from './lib/components/button';
```

- [ ] **Step 5: Verificar que el build de la librería no falla**

```powershell
ng build ngx-ds
```

Salida esperada: build finaliza sin errores. Puede mostrar warnings menores.

- [ ] **Step 6: Commit**

```powershell
git add projects/ngx-ds/
git commit -m "chore(ngx-ds): scaffold library structure with components, directives, pipes folders"
```

---

## Task 4: Crear el entry point de estilos de la librería

**Files:**
- Crea: `projects/ngx-ds/styles/index.scss`

- [ ] **Step 1: Crear la carpeta styles dentro de la librería**

```powershell
New-Item -ItemType Directory -Force "projects/ngx-ds/styles"
```

- [ ] **Step 2: Crear index.scss con las directivas de Tailwind y placeholder de tokens**

Crea `projects/ngx-ds/styles/index.scss` con este contenido exacto:

```scss
// ngx-ds Design System — Global Styles
// Import this file in any consuming app's styles.scss:
//   @use 'ngx-ds/styles/index' as *;

@tailwind base;
@tailwind components;
@tailwind utilities;

// ─── Design Tokens ────────────────────────────────────────────────────────────
// Add CSS custom properties here as the design system grows.
// Example:
//   :root {
//     --ngx-color-primary: theme('colors.blue.600');
//     --ngx-font-sans: theme('fontFamily.sans');
//   }
```

- [ ] **Step 3: Verificar que el archivo existe**

```powershell
Test-Path "projects/ngx-ds/styles/index.scss"
```

Salida esperada: `True`.

- [ ] **Step 4: Commit**

```powershell
git add projects/ngx-ds/styles/
git commit -m "feat(ngx-ds): add styles entry point with Tailwind directives"
```

---

## Task 5: Instalar TailwindCSS v3 y crear la configuración

**Files:**
- Modifica: `package.json` (devDependencies)
- Crea: `tailwind.config.js`

- [ ] **Step 1: Instalar TailwindCSS v3 con PostCSS y Autoprefixer**

```powershell
npm install -D tailwindcss@3 postcss autoprefixer
```

Salida esperada: se agregan las tres dependencias a `package.json` bajo `devDependencies`. No debe haber errores de resolución de paquetes.

- [ ] **Step 2: Crear tailwind.config.js en la raíz del workspace**

Crea `tailwind.config.js` con este contenido exacto:

```js
/** @type {import('tailwindcss').Config} */
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

- [ ] **Step 3: Verificar que Tailwind reconoce la configuración**

```powershell
npx tailwindcss --version
```

Salida esperada: `3.x.x`

- [ ] **Step 4: Commit**

```powershell
git add tailwind.config.js package.json package-lock.json
git commit -m "chore: install TailwindCSS v3 and add workspace config"
```

---

## Task 6: Actualizar tsconfig.json — paths de la librería apuntan a source

**Files:**
- Modifica: `tsconfig.json`

**Por qué:** Angular CLI agrega el path `ngx-ds → dist/ngx-ds`. Esto requiere compilar la librería antes de poder usarla en las apps. Cambiarlo a la fuente permite desarrollo sin build previo.

- [ ] **Step 1: Ver el tsconfig.json actual**

```powershell
Get-Content tsconfig.json
```

Busca la sección `compilerOptions.paths`. Angular CLI habrá generado algo como:

```json
"ngx-ds": [
  "dist/ngx-ds/ngx-ds",
  "dist/ngx-ds"
]
```

- [ ] **Step 2: Reemplazar los paths para apuntar a la fuente**

En `tsconfig.json`, dentro de `compilerOptions.paths`, reemplaza la entrada `ngx-ds` para que quede:

```json
"paths": {
  "ngx-ds": [
    "projects/ngx-ds/src/public-api.ts"
  ]
}
```

El `tsconfig.json` completo resultante debe verse así (los valores de `strict`, `target`, etc. los generó `ng new`; no los cambies):

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "outDir": "./dist/out-tsc",
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "moduleResolution": "bundler",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "lib": [
      "ES2022",
      "dom"
    ],
    "paths": {
      "ngx-ds": [
        "projects/ngx-ds/src/public-api.ts"
      ]
    }
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}
```

> **Nota:** No copies el JSON completo del plan — solo modifica la sección `paths`. El resto de los valores los generó `ng new` y pueden variar ligeramente entre versiones de Angular CLI.

- [ ] **Step 3: Verificar que el build de la librería sigue funcionando**

```powershell
ng build ngx-ds
```

Salida esperada: build sin errores.

- [ ] **Step 4: Commit**

```powershell
git add tsconfig.json
git commit -m "chore: point ngx-ds tsconfig path to source for development"
```

---

## Task 7: Crear la carpeta de casos de uso

**Files:**
- Crea: `projects/use-cases/.gitkeep`

- [ ] **Step 1: Crear la carpeta con un .gitkeep para que git la rastree**

```powershell
New-Item -ItemType Directory -Force "projects/use-cases"
New-Item -ItemType File "projects/use-cases/.gitkeep"
```

- [ ] **Step 2: Verificar**

```powershell
Test-Path "projects/use-cases/.gitkeep"
```

Salida esperada: `True`.

- [ ] **Step 3: Commit**

```powershell
git add projects/use-cases/
git commit -m "chore: add use-cases directory placeholder"
```

---

## Task 8: Crear la guía HOW-TO-ADD-USE-CASE.md

**Files:**
- Crea: `docs/HOW-TO-ADD-USE-CASE.md`

- [ ] **Step 1: Crear el archivo de documentación**

Crea `docs/HOW-TO-ADD-USE-CASE.md` con este contenido exacto:

````markdown
# Cómo agregar un nuevo caso de uso

Cada caso de uso es una app Angular independiente que vive en `projects/use-cases/<nombre>/`.
Reemplaza `<nombre>` con el nombre del componente en **kebab-case** (ej: `button`, `data-table`, `modal`).

---

## Paso 1 — Crear la estructura de carpetas

```powershell
New-Item -ItemType Directory -Force "projects/use-cases/<nombre>/src/app"
```

---

## Paso 2 — Crear los archivos mínimos

Crea cada uno de los siguientes archivos con el contenido indicado:

### `projects/use-cases/<nombre>/index.html`

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Use Case: <Nombre></title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

### `projects/use-cases/<nombre>/tsconfig.app.json`

```json
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "outDir": "../../../out-tsc/use-cases/<nombre>",
    "types": []
  },
  "files": [
    "src/main.ts"
  ],
  "include": [
    "src/**/*.d.ts"
  ]
}
```

### `projects/use-cases/<nombre>/src/main.ts`

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

### `projects/use-cases/<nombre>/src/styles.scss`

```scss
@use 'ngx-ds/styles/index' as *;
```

### `projects/use-cases/<nombre>/src/app/app.config.ts`

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
  ]
};
```

### `projects/use-cases/<nombre>/src/app/app.component.ts`

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
```

### `projects/use-cases/<nombre>/src/app/app.component.html`

```html
<main class="p-8">
  <h1 class="text-2xl font-bold mb-4">Use Case: &lt;Nombre&gt;</h1>
  <!-- Ejemplos del componente aquí -->
</main>
```

### `projects/use-cases/<nombre>/src/app/app.component.scss`

Dejar vacío (el archivo debe existir pero no necesita contenido inicial).

---

## Paso 3 — Registrar la app en angular.json

Abre `angular.json` y agrega el siguiente bloque dentro del objeto `"projects": { ... }`, después de la entrada `"ngx-ds"`:

```json
"use-case-<nombre>": {
  "projectType": "application",
  "schematics": {},
  "root": "projects/use-cases/<nombre>",
  "sourceRoot": "projects/use-cases/<nombre>/src",
  "prefix": "app",
  "architect": {
    "build": {
      "builder": "@angular/build:application",
      "options": {
        "outputPath": "dist/use-cases/<nombre>",
        "index": "projects/use-cases/<nombre>/index.html",
        "browser": "projects/use-cases/<nombre>/src/main.ts",
        "polyfills": [],
        "tsConfig": "projects/use-cases/<nombre>/tsconfig.app.json",
        "inlineStyleLanguage": "scss",
        "assets": [],
        "styles": [
          "projects/use-cases/<nombre>/src/styles.scss"
        ],
        "scripts": [],
        "stylePreprocessorOptions": {
          "includePaths": ["projects"]
        }
      },
      "configurations": {
        "production": {
          "budgets": [
            {
              "type": "initial",
              "maximumWarning": "500kB",
              "maximumError": "1MB"
            }
          ],
          "outputHashing": "all"
        },
        "development": {
          "optimization": false,
          "extractLicenses": false,
          "sourceMap": true
        }
      },
      "defaultConfiguration": "development"
    },
    "serve": {
      "builder": "@angular/build:dev-server",
      "configurations": {
        "production": {
          "buildTarget": "use-case-<nombre>:build:production"
        },
        "development": {
          "buildTarget": "use-case-<nombre>:build:development"
        }
      },
      "defaultConfiguration": "development"
    }
  }
}
```

---

## Paso 4 — Importar componentes de ngx-ds

Dentro de la app del caso de uso, importa los componentes de la librería directamente:

```typescript
// src/app/app.component.ts
import { Component } from '@angular/core';
import { ButtonComponent } from 'ngx-ds'; // path resuelto por tsconfig.json

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
```

---

## Paso 5 — Levantar el caso de uso

```powershell
ng serve --project=use-case-<nombre>
```

Navega a `http://localhost:4200`.

Para compilar (sin serve):

```powershell
ng build --project=use-case-<nombre>
```

---

## Ejemplo completo: caso de uso `button`

Siguiendo los pasos anteriores con `<nombre>` = `button`:

```
projects/use-cases/button/
├── index.html
├── tsconfig.app.json
└── src/
    ├── main.ts
    ├── styles.scss
    └── app/
        ├── app.config.ts
        ├── app.component.ts
        ├── app.component.html
        └── app.component.scss
```

Entrada en `angular.json`: `"use-case-button"` (reemplazando todos los `<nombre>` por `button`).

Levantar: `ng serve --project=use-case-button`
````

- [ ] **Step 2: Verificar que el archivo fue creado**

```powershell
Test-Path "docs/HOW-TO-ADD-USE-CASE.md"
Get-Content "docs/HOW-TO-ADD-USE-CASE.md" | Measure-Object -Line
```

Salida esperada: `True` y más de 100 líneas.

- [ ] **Step 3: Commit**

```powershell
git add docs/HOW-TO-ADD-USE-CASE.md
git commit -m "docs: add guide for creating use-case apps"
```

---

## Task 9: Verificación final del workspace

- [ ] **Step 1: Verificar la estructura de carpetas completa**

```powershell
Get-ChildItem -Recurse -Depth 4 "projects/" | Where-Object { !$_.PSIsContainer } | Select-Object FullName
```

Salida esperada: debe incluir todos los archivos de `projects/ngx-ds/` y `projects/use-cases/.gitkeep`.

- [ ] **Step 2: Compilar la librería**

```powershell
ng build ngx-ds
```

Salida esperada: `Build complete.` sin errores. Se crea `dist/ngx-ds/`.

- [ ] **Step 3: Verificar que Tailwind está instalado correctamente**

```powershell
Get-Content "tailwind.config.js"
node -e "require('tailwindcss'); console.log('Tailwind OK')"
```

Salida esperada: muestra el contenido del config y `Tailwind OK`.

- [ ] **Step 4: Commit final de verificación**

```powershell
git add .
git commit -m "chore: complete monorepo scaffold — ngx-ds library + use-cases structure"
```

---

## Resumen del resultado final

```
DS-Projects/
├── projects/
│   ├── ngx-ds/
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── components/
│   │   │   │   ├── directives/
│   │   │   │   └── pipes/
│   │   │   └── public-api.ts
│   │   ├── styles/
│   │   │   └── index.scss
│   │   ├── ng-package.json
│   │   ├── package.json
│   │   └── tsconfig.lib.json
│   └── use-cases/
│       └── .gitkeep
├── docs/
│   ├── HOW-TO-ADD-USE-CASE.md
│   └── superpowers/
├── tailwind.config.js
├── angular.json
├── package.json
└── tsconfig.json
```

**Para agregar el primer componente a la librería:** crea la carpeta en `projects/ngx-ds/src/lib/components/<nombre>/` y exporta desde `public-api.ts`.

**Para agregar un caso de uso:** sigue `docs/HOW-TO-ADD-USE-CASE.md`.
