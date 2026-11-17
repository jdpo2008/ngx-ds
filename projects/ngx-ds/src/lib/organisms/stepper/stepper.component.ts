import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  input,
  model,
  output,
} from '@angular/core';
import { Check, X } from 'lucide-angular';
import { StepComponent } from './step.component';
import { IconComponent } from '../../atoms/icon/icon.component';

export type StepperOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'ngx-ds-stepper',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperComponent {
  readonly steps = contentChildren(StepComponent);
  readonly active = model<number>(0);
  readonly orientation = input<StepperOrientation>('horizontal');
  readonly clickable = input<boolean>(false);

  readonly stepChange = output<number>();

  readonly canGoNext = computed(() => this.active() < this.steps().length - 1);
  readonly canGoPrev = computed(() => this.active() > 0);

  protected readonly icons = { Check, X };

  readonly hostClasses = computed(() => `stepper stepper--${this.orientation()}`);

  constructor() {
    effect(
      () => {
        const idx = this.active();
        this.steps().forEach((step, i) => step.setActive(i === idx));
      },
      { allowSignalWrites: true },
    );
  }

  isActive(index: number): boolean {
    return this.active() === index;
  }
  isCompleted(index: number): boolean {
    return index < this.active();
  }

  goTo(index: number): void {
    if (!this.clickable()) return;
    this.active.set(index);
    this.stepChange.emit(index);
  }

  next(): void {
    if (this.canGoNext()) {
      this.active.update((v) => v + 1);
      this.stepChange.emit(this.active());
    }
  }

  previous(): void {
    if (this.canGoPrev()) {
      this.active.update((v) => v - 1);
      this.stepChange.emit(this.active());
    }
  }
}
