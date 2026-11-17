import { TestBed } from '@angular/core/testing';
import { SearchInputComponent } from '../molecules/search-input/search-input.component';
import { PaginationComponent } from '../organisms/pagination/pagination.component';
import { ConfirmationService } from '../services/confirmation.service';
import { NGX_DS_LABELS, NGX_DS_LABELS_EN, NGX_DS_LABELS_ES, provideNgxDsLabels } from './labels';

function searchPlaceholder(): string | null {
  const fixture = TestBed.createComponent(SearchInputComponent);
  fixture.detectChanges();
  return (fixture.nativeElement as HTMLElement).querySelector('input')!.getAttribute('placeholder');
}

describe('NGX_DS_LABELS', () => {
  it('defaults to Spanish', () => {
    expect(TestBed.inject(NGX_DS_LABELS)).toBe(NGX_DS_LABELS_ES);
    expect(searchPlaceholder()).toBe('Buscar...');
  });

  it('switches components to English with provideNgxDsLabels', () => {
    TestBed.configureTestingModule({ providers: [provideNgxDsLabels(NGX_DS_LABELS_EN)] });
    expect(searchPlaceholder()).toBe('Search...');

    const fixture = TestBed.createComponent(PaginationComponent);
    fixture.componentRef.setInput('totalPages', 5);
    fixture.detectChanges();
    const nav = (fixture.nativeElement as HTMLElement).querySelector('nav');
    expect(nav?.getAttribute('aria-label')).toBe('Pagination');
  });

  it('merges a partial override over the base labels', () => {
    TestBed.configureTestingModule({
      providers: [provideNgxDsLabels({ searchPlaceholder: 'Rechercher...' }, NGX_DS_LABELS_EN)],
    });
    const labels = TestBed.inject(NGX_DS_LABELS);
    expect(labels.searchPlaceholder).toBe('Rechercher...');
    expect(labels.close).toBe('Close');
    expect(searchPlaceholder()).toBe('Rechercher...');
  });

  it('lets an explicit input win over the label', () => {
    const fixture = TestBed.createComponent(SearchInputComponent);
    fixture.componentRef.setInput('placeholder', 'Filtrar');
    fixture.detectChanges();
    const input = (fixture.nativeElement as HTMLElement).querySelector('input')!;
    expect(input.getAttribute('placeholder')).toBe('Filtrar');
  });

  it('uses the labels as confirmation defaults', () => {
    TestBed.configureTestingModule({ providers: [provideNgxDsLabels(NGX_DS_LABELS_EN)] });
    const service = TestBed.inject(ConfirmationService);
    void service.confirm({ title: 't', message: 'm' });
    expect(service.state().confirmText).toBe('Confirm');
    expect(service.state().cancelText).toBe('Cancel');
  });
});
