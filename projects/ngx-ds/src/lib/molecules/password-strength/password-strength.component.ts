import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export type PasswordStrengthLevel = 'none' | 'weak' | 'fair' | 'good' | 'strong';

export interface PasswordCriterion {
  label: string;
  met: boolean;
}

const STRENGTH_LABELS: Record<PasswordStrengthLevel, string> = {
  none: '',
  weak: 'Débil',
  fair: 'Regular',
  good: 'Buena',
  strong: 'Fuerte',
};

@Component({
  selector: 'ngx-ds-password-strength',
  standalone: true,
  templateUrl: './password-strength.component.html',
  styleUrl: './password-strength.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordStrengthComponent {
  // ── Value ────────────────────────────────────────────────────
  readonly password = input<string>('');

  // ── Rules (all configurable) ─────────────────────────────────
  readonly minLength = input<number>(8);
  readonly maxLength = input<number | undefined>(undefined);
  readonly requireLowercase = input<boolean>(true);
  readonly requireUppercase = input<boolean>(true);
  readonly requireNumbers = input<boolean>(true);
  readonly requireSpecial = input<boolean>(false);

  // ── Display ──────────────────────────────────────────────────
  readonly showLabel = input<boolean>(true);
  readonly showRequirements = input<boolean>(false);

  readonly segments = [1, 2, 3, 4];

  // ── Active criteria list ──────────────────────────────────────
  readonly requirements = computed((): PasswordCriterion[] => {
    const p = this.password();
    const list: PasswordCriterion[] = [];

    list.push({
      label: `Mínimo ${this.minLength()} caracteres`,
      met: p.length >= this.minLength(),
    });

    const max = this.maxLength();
    if (max !== undefined) {
      list.push({
        label: `Máximo ${max} caracteres`,
        met: p.length > 0 && p.length <= max,
      });
    }

    if (this.requireLowercase()) {
      list.push({ label: 'Al menos una minúscula (a–z)', met: /[a-z]/.test(p) });
    }

    if (this.requireUppercase()) {
      list.push({ label: 'Al menos una mayúscula (A–Z)', met: /[A-Z]/.test(p) });
    }

    if (this.requireNumbers()) {
      list.push({ label: 'Al menos un número (0–9)', met: /[0-9]/.test(p) });
    }

    if (this.requireSpecial()) {
      list.push({ label: 'Al menos un carácter especial (!@#…)', met: /[^a-zA-Z0-9]/.test(p) });
    }

    return list;
  });

  // ── Score 0–4 based on ratio of active criteria met ──────────
  readonly score = computed((): number => {
    if (!this.password()) return 0;
    const reqs = this.requirements();
    const total = reqs.length;
    const met = reqs.filter((r) => r.met).length;
    if (total === 0 || met === 0) return 1;
    const ratio = met / total;
    if (ratio <= 0.35) return 1;
    if (ratio <= 0.6) return 2;
    if (ratio < 1) return 3;
    return 4;
  });

  readonly strengthLevel = computed((): PasswordStrengthLevel => {
    const levels: PasswordStrengthLevel[] = ['none', 'weak', 'fair', 'good', 'strong'];
    return levels[this.score()];
  });

  readonly strengthLabel = computed(() => STRENGTH_LABELS[this.strengthLevel()]);
}
