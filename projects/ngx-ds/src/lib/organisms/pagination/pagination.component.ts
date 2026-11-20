import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  computed,
  output,
  inject,
} from '@angular/core';
import { ButtonComponent } from '../../atoms/button/button.component';
import { NGX_DS_LABELS } from '../../shared/labels';

@Component({
  selector: 'ngx-ds-pagination',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  readonly i18n = inject(NGX_DS_LABELS);

  readonly totalPages = input.required<number>();
  readonly siblings = input<number>(1);
  readonly showBoundary = input<boolean>(true);

  readonly currentPage = model<number>(1);

  readonly pageChange = output<number>();

  readonly pages = computed<(number | '...')[]>(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const siblings = this.siblings();

    if (total <= 0) return [];
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    if (!this.showBoundary()) {
      const start = Math.max(1, current - siblings);
      const end = Math.min(total, current + siblings);
      return Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => start + i);
    }

    const left = Math.max(2, current - siblings);
    const right = Math.min(total - 1, current + siblings);

    const items: (number | '...')[] = [1];

    // An ellipsis that would stand for a single page shows that page instead.
    if (left === 3) items.push(2);
    else if (left > 3) items.push('...');
    for (let i = left; i <= right; i++) items.push(i);
    if (right === total - 2) items.push(total - 1);
    else if (right < total - 2) items.push('...');

    items.push(total);
    return items;
  });

  go(page: number | '...'): void {
    const total = this.totalPages();
    if (page === '...' || total < 1) return;
    const clamped = Math.min(Math.max(1, page), total);
    if (clamped === this.currentPage()) return;
    this.currentPage.set(clamped);
    this.pageChange.emit(clamped);
  }

  prev(): void {
    this.go(this.currentPage() - 1);
  }
  next(): void {
    this.go(this.currentPage() + 1);
  }
}
