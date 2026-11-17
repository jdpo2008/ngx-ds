import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from '../../services/confirmation.service';
import { ButtonComponent } from '../../atoms/button/button.component';
import { FocusTrapDirective } from '../../directives/focus-trap/focus-trap.directive';
import { setupEscapeClose } from '../../shared/escape-close';

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

  constructor() {
    setupEscapeClose(() => {
      if (this.state().isOpen) this.onCancel();
    });
  }

  onConfirm(): void {
    this.confirmationService.handleConfirm();
  }

  onCancel(): void {
    this.confirmationService.handleCancel();
  }

  onBackdropClick(): void {
    // Optional: Close on backdrop click, or remove this if you want to force explicit choice
    // this.confirmationService.handleCancel();
  }
}
