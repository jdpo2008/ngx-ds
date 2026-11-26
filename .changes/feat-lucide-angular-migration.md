### Added

- `IconInput` type: any icon the components accept — an `@lucide/angular` icon component (`LucideX`), its data object (`LucideX.icon`), or a `lucide-angular` icon array.

### Changed

- Icons now render with `@lucide/angular`, which replaces `lucide-angular` as the peer dependency (`npm install @lucide/angular`). `lucide-angular` is no longer maintained and does not support Angular 22. Icons from `lucide-angular` still work as inputs.
- `ng add` installs `@lucide/angular` instead of `lucide-angular`.

### Deprecated

- The `LucideIconData` type and passing `lucide-angular` icons. Import icons from `@lucide/angular` (`import { LucideX } from '@lucide/angular'`) and type them as `IconInput`.
