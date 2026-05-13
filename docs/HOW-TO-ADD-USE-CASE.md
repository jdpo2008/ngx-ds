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
