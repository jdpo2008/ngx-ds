import { TestBed } from '@angular/core/testing';
import { DescriptionItem, DescriptionListComponent } from './description-list.component';

const ITEMS: DescriptionItem[] = [
  { label: 'Nombre', value: 'Ana García' },
  { label: 'Pedidos', value: 12 },
  { label: 'Teléfono', value: null },
  { label: 'ID', value: 'usr_123', copyable: true },
];

describe('DescriptionListComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(DescriptionListComponent);
    fixture.componentRef.setInput('items', ITEMS);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('renders a dl with a dt/dd pair per item', () => {
    const { el } = setup();
    const terms = [...el.querySelectorAll('dl > div > dt')].map((n) => n.textContent?.trim());
    const values = [...el.querySelectorAll('dl > div > dd .dl__value')].map((n) =>
      n.textContent?.trim(),
    );
    expect(terms).toEqual(['Nombre', 'Pedidos', 'Teléfono', 'ID']);
    expect(values).toEqual(['Ana García', '12', '—', 'usr_123']);
  });

  it('uses the emptyValue placeholder', () => {
    const { el } = setup({ emptyValue: 'Sin datos' });
    expect(el.querySelector('.dl__value--empty')?.textContent?.trim()).toBe('Sin datos');
  });

  it('applies layout, size, divided and grid classes', () => {
    const { el } = setup({ layout: 'vertical', size: 'sm', columns: 2, divided: false });
    const dl = el.querySelector('dl')!;
    expect([...dl.classList].sort()).toEqual(['dl', 'dl--grid', 'dl--sm', 'dl--vertical']);
    expect(dl.style.getPropertyValue('--dl-columns')).toBe('2');
  });

  it('copies a value, announces it and emits the item', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    const { fixture, el } = setup();
    const emitted: DescriptionItem[] = [];
    fixture.componentInstance.copied.subscribe((i) => emitted.push(i));

    const buttons = el.querySelectorAll<HTMLButtonElement>('.dl__copy');
    expect(buttons.length).toBe(1);
    expect(buttons[0].getAttribute('aria-label')).toBe('Copiar ID');

    buttons[0].click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(writeText).toHaveBeenCalledWith('usr_123');
    expect(emitted).toEqual([ITEMS[3]]);
    expect(buttons[0].classList).toContain('dl__copy--done');
    expect(el.querySelector('.dl__status')?.textContent?.trim()).toBe('Copiado');
  });

  it('gives no feedback when the clipboard fails', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    const { fixture, el } = setup();
    el.querySelector<HTMLButtonElement>('.dl__copy')!.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.componentInstance.copiedIndex()).toBeNull();
  });
});
