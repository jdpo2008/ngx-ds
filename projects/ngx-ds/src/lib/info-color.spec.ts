import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LucideInfo as Info } from '@lucide/angular';
import { AvatarComponent } from './atoms/avatar/avatar.component';
import { BadgeComponent } from './atoms/badge/badge.component';
import { ButtonComponent } from './atoms/button/button.component';
import { IconButtonComponent } from './atoms/icon-button/icon-button.component';
import { MenuButtonComponent } from './atoms/menu-button/menu-button.component';
import { ProgressBarComponent } from './atoms/progress-bar/progress-bar.component';
import { SpinnerComponent } from './atoms/spinner/spinner.component';
import { TagComponent } from './atoms/tag/tag.component';
import { CheckboxComponent } from './molecules/checkbox/checkbox.component';
import { RadioComponent } from './molecules/radio/radio.component';
import { SwitchComponent } from './molecules/switch/switch.component';

const CASES: [string, Type<unknown>, Record<string, unknown>?][] = [
  ['Avatar', AvatarComponent],
  ['Badge', BadgeComponent],
  ['Button', ButtonComponent],
  ['IconButton', IconButtonComponent, { icon: Info, ariaLabel: 'Info' }],
  ['MenuButton', MenuButtonComponent],
  ['ProgressBar', ProgressBarComponent],
  ['Spinner', SpinnerComponent],
  ['Tag', TagComponent, { label: 'Info' }],
  ['Checkbox', CheckboxComponent],
  ['Radio', RadioComponent, { value: 'a' }],
  ['Switch', SwitchComponent],
];

describe.each(CASES)('%s info colour', (_name, component, inputs = {}) => {
  it('renders the info modifier class', () => {
    const fixture = TestBed.createComponent(component);
    for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
    fixture.componentRef.setInput('color', 'info');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const all = [el, ...Array.from(el.querySelectorAll('*'))];
    const hasInfo = all.some((node) =>
      Array.from(node.classList).some((cls) => cls.endsWith('--info')),
    );
    expect(hasInfo).toBe(true);
  });
});
