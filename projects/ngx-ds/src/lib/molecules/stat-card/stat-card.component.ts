import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import {
  LucideMinus as Minus,
  LucideTrendingDown as TrendingDown,
  LucideTrendingUp as TrendingUp,
} from '@lucide/angular';
import { IconInput } from '../../atoms/icon/icon.types';
import { IconComponent } from '../../atoms/icon/icon.component';
import { NGX_DS_LABELS } from '../../shared/labels';

export type StatTrend = 'up' | 'down' | 'neutral';
/** Whether the change is good, bad or neither for the metric. */
export type StatSentiment = 'positive' | 'negative' | 'neutral';

/**
 * Metric tile for dashboards: label, value, change against a previous period
 * and an optional icon. Use `invertTrend` for metrics where lower is better
 * (costs, errors, churn). Slot: `[stat-footer]` (sparkline, link, note).
 */
@Component({
  selector: 'ngx-ds-stat-card',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {
  readonly i18n = inject(NGX_DS_LABELS);

  readonly label = input.required<string>();
  /** Already formatted value ("1.240", "12,5 k€") or a raw number. */
  readonly value = input.required<string | number>();
  /** Percentage change against the previous period, e.g. 12.5 or -3. */
  readonly delta = input<number | null>(null);
  /** Context for the change, e.g. "vs. mes anterior". */
  readonly deltaLabel = input<string | undefined>(undefined);
  /** Lower is better: a decrease is shown as positive. */
  readonly invertTrend = input<boolean>(false);
  readonly icon = input<IconInput | undefined>(undefined);
  /** Shows placeholders instead of the value and change. */
  readonly loading = input<boolean>(false);

  /** The change rounded to one decimal, as shown (drops noise like 12.499999). */
  readonly #shownDelta = computed(() => {
    const d = this.delta();
    return d === null ? null : Math.round(d * 10) / 10;
  });

  readonly trend = computed<StatTrend>(() => {
    // From the shown value, so a change that rounds to 0% reads as no change.
    const d = this.#shownDelta();
    if (d === null || d === 0) return 'neutral';
    return d > 0 ? 'up' : 'down';
  });

  readonly sentiment = computed<StatSentiment>(() => {
    const t = this.trend();
    if (t === 'neutral') return 'neutral';
    return (t === 'up') !== this.invertTrend() ? 'positive' : 'negative';
  });

  readonly trendIcon = computed<IconInput>(() => {
    const t = this.trend();
    return t === 'up' ? TrendingUp : t === 'down' ? TrendingDown : Minus;
  });

  readonly deltaText = computed(() => {
    const d = this.#shownDelta();
    if (d === null) return '';
    const abs = Math.abs(d);
    const sign = d > 0 ? '+' : d < 0 ? '−' : '';
    return `${sign}${abs}%`;
  });

  readonly trendText = computed(() => {
    const t = this.trend();
    return t === 'up' ? this.i18n.increase : t === 'down' ? this.i18n.decrease : this.i18n.noChange;
  });
}
