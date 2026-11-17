import { TestBed } from '@angular/core/testing';
import { NGX_DS_LABELS_EN, provideNgxDsLabels } from '../../shared/labels';
import { FileUploadComponent, UploadedFile } from './file-upload.component';

const MB = 1024 * 1024;

function makeFile(name: string, size: number): File {
  const file = new File(['x'], name, { type: 'text/plain' });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

describe('FileUploadComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(FileUploadComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const cmp = fixture.componentInstance;
    const emitted: UploadedFile[][] = [];
    cmp.filesChange.subscribe((f) => emitted.push(f));
    const input = el.querySelector<HTMLInputElement>('input[type="file"]')!;
    const select = (...files: File[]) => {
      Object.defineProperty(input, 'files', { value: files, configurable: true });
      input.dispatchEvent(new Event('change'));
      fixture.detectChanges();
    };
    const drop = (...files: File[]) => {
      cmp.onDrop({ preventDefault: () => {}, dataTransfer: { files } } as unknown as DragEvent);
      fixture.detectChanges();
    };
    const items = () => Array.from(el.querySelectorAll('.upload-file'));
    return { fixture, cmp, el, emitted, select, drop, items };
  }

  it('replaces the file when multiple is off', () => {
    const { emitted, select, items } = setup();
    select(makeFile('a.txt', 10));
    select(makeFile('b.txt', 10));
    expect(items().length).toBe(1);
    expect(items()[0].textContent).toContain('b.txt');
    expect(emitted.length).toBe(2);
  });

  it('appends files up to maxFiles when multiple is on', () => {
    const { cmp, drop } = setup({ multiple: true, maxFiles: 2 });
    drop(makeFile('a.txt', 1), makeFile('b.txt', 1), makeFile('c.txt', 1));
    expect(cmp.files().map((f) => f.name)).toEqual(['a.txt', 'b.txt']);
  });

  it('flags files over maxSizeMb with a translated error', () => {
    const { cmp, items, select } = setup({ maxSizeMb: 1 });
    select(makeFile('big.txt', 2 * MB));
    expect(cmp.files()[0].status).toBe('invalid');
    expect(items()[0].classList).toContain('upload-file--invalid');
    expect(items()[0].querySelector('.upload-file__meta')?.textContent).toContain(
      'Supera el máximo de 1 MB',
    );
  });

  it('uses the English error when English labels are provided', () => {
    TestBed.configureTestingModule({ providers: [provideNgxDsLabels(NGX_DS_LABELS_EN)] });
    const { cmp, select } = setup({ maxSizeMb: 1 });
    select(makeFile('big.txt', 2 * MB));
    expect(cmp.files()[0].error).toBe('Exceeds the 1 MB limit');
  });

  it('removes a file and emits the new list', () => {
    const { cmp, emitted, select } = setup();
    select(makeFile('a.txt', 1));
    cmp.removeFile(cmp.files()[0].id);
    expect(cmp.files()).toEqual([]);
    expect(emitted.at(-1)).toEqual([]);
  });

  it('ignores drops while disabled', () => {
    const { cmp, el, drop } = setup({ disabled: true });
    expect(el.querySelector('.upload-zone--disabled')).not.toBeNull();
    drop(makeFile('a.txt', 1));
    expect(cmp.files()).toEqual([]);
  });
});
