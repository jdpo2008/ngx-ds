import { ChangeDetectionStrategy, Component, computed, input, output, inject } from '@angular/core';
import { ChevronRight, LucideIconData } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { Size } from '../../shared/size';
import { NGX_DS_LABELS } from '../../shared/labels';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIconData;
  disabled?: boolean;
}

export type BreadcrumbSize = Size;

const ICON_SIZE: Record<BreadcrumbSize, number> = { sm: 12, md: 14, lg: 16 };

@Component({
  selector: 'ngx-ds-breadcrumb',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {
  readonly i18n = inject(NGX_DS_LABELS);

  readonly items = input<BreadcrumbItem[]>([]);
  readonly size = input<BreadcrumbSize>('md');
  readonly maxItems = input<number>(0); // 0 = show all
  readonly separator = input<LucideIconData | string>(ChevronRight);

  readonly itemClick = output<BreadcrumbItem>();

  protected readonly separatorIsIcon = computed(() => typeof this.separator() !== 'string');
  protected readonly separatorIcon = computed(() =>
    typeof this.separator() === 'string' ? null : (this.separator() as LucideIconData),
  );
  protected readonly separatorChar = computed(() =>
    typeof this.separator() === 'string' ? (this.separator() as string) : '',
  );

  protected readonly iconSize = computed(() => ICON_SIZE[this.size()]);

  protected readonly visibleItems = computed(() => {
    const all = this.items();
    const max = this.maxItems();
    if (!max || all.length <= max) return all;

    // Show first + ellipsis + last (max-1) items
    const keep = max - 1;
    return [all[0], { label: '…', disabled: true }, ...all.slice(all.length - keep)];
  });

  protected isLast(index: number): boolean {
    return index === this.visibleItems().length - 1;
  }

  protected onClick(item: BreadcrumbItem): void {
    if (!item.disabled) this.itemClick.emit(item);
  }
}
