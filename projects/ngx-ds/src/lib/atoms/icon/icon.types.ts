import type { LucideIcon, LucideIconData as LucideIconObject } from '@lucide/angular';

/** One SVG child of an icon in the `lucide-angular` format: `[tag, attributes]`. */
export type LegacyIconNode = readonly [string, Record<string, string | number | undefined>];

/**
 * An icon in the `lucide-angular` format, e.g. `import { X } from 'lucide-angular'`.
 *
 * @deprecated `lucide-angular` is no longer maintained. Import icons from `@lucide/angular`
 * (`LucideX`) and type them as {@link IconInput}.
 */
export type LucideIconData = readonly LegacyIconNode[];

/**
 * Any icon an ngx-ds component accepts:
 * - an icon component from `@lucide/angular` (`LucideX`),
 * - its data object (`LucideX.icon`),
 * - an icon from `lucide-angular` (`X`), kept for backwards compatibility.
 */
export type IconInput = LucideIcon | LucideIconObject | LucideIconData;
