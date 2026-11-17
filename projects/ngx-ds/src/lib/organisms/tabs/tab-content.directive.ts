import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: '[ngxDsTabContent]',
  standalone: true,
})
export class TabContentDirective {
  readonly templateRef = inject(TemplateRef);
}
