import { Component, ChangeDetectionStrategy, input, model, computed, output } from '@angular/core';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
  selector: 'ngx-ds-pagination',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
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

    const left = Math.max(2, current - siblings);
    const right = Math.min(total - 1, current + siblings);

    const items: (number | '...')[] = [1];

    if (left > 2) items.push('...');
    for (let i = left; i <= right; i++) items.push(i);
    if (right < total - 1) items.push('...');

    items.push(total);
    return items;
  });

  go(page: number | '...'): void {
    if (page === '...') return;
    const clamped = Math.min(Math.max(1, page), this.totalPages());
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
