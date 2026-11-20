import { Component, ChangeDetectionStrategy, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from '../../services/confirmation.service';
import { ButtonComponent } from '../../atoms/button/button.component';
import { FocusTrapDirective } from '../../directives/focus-trap/focus-trap.directive';
import { setupEscapeClose } from '../../shared/escape-close';
import { setupOverlay } from '../../shared/overlay-stack';

@Component({
  selector: 'ngx-ds-confirmation',
  standalone: true,
  imports: [CommonModule, ButtonComponent, FocusTrapDirective],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationComponent {
  readonly confirmationService = inject(ConfirmationService);
  readonly state = this.confirmationService.state;
  /** Clicking the backdrop cancels the dialog (same as Escape). */
  readonly closeOnBackdrop = input<boolean>(true);

  constructor() {
    const isTop = setupOverlay(computed(() => this.state().isOpen));
    setupEscapeClose(() => {
      if (this.state().isOpen && isTop()) this.onCancel();
    });
  }

  onConfirm(): void {
    this.confirmationService.handleConfirm();
  }

  onCancel(): void {
    this.confirmationService.handleCancel();
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop()) this.onCancel();
  }
}
