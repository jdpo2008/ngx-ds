import { InjectionToken } from '@angular/core';

export interface AccordionController {
  itemOpened(item: unknown): void;
}

export const ACCORDION_CONTROLLER = new InjectionToken<AccordionController>('ACCORDION_CONTROLLER');
