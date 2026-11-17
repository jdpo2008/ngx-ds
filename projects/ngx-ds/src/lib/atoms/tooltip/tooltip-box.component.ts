import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';

@Component({
  selector: 'ngx-ds-tooltip-box',
  standalone: true,
  template: `
    <div class="ngx-tooltip" role="tooltip" [class.ngx-tooltip--visible]="visible()">
      {{ content() }}
    </div>
  `,
  // ViewEncapsulation.None so styles reach the body-appended element
  styles: [
    `
      .ngx-tooltip {
        position: fixed;
        z-index: 9000;
        max-width: 14rem;
        padding: 0.375rem 0.625rem;
        background: #111827;
        color: #fff;
        font-size: 0.75rem;
        font-family: var(--ngx-primary-font-family, 'Poppins', sans-serif);
        line-height: 1.4;
        border-radius: 0.375rem;
        pointer-events: none;
        white-space: normal;
        word-break: break-word;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        opacity: 0;
        transform: scale(0.95);
        transition:
          opacity 0.15s ease,
          transform 0.15s ease;
      }
      .ngx-tooltip--visible {
        opacity: 1;
        transform: scale(1);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipBoxComponent {
  readonly content = signal('');
  readonly visible = signal(false);
}
