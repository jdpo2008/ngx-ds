import {
  LucideFile as FileIcon,
  LucideFileImage as FileImage,
  LucideFileText as FileText,
  LucideFileVideo as FileVideo,
} from '@lucide/angular';
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

describe('FileUploadComponent behaviour', () => {
  function typed(name: string, type: string, size = 10): File {
    const file = new File(['x'], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
  }

  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(FileUploadComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const cmp = fixture.componentInstance;
    const emitted: UploadedFile[][] = [];
    cmp.filesChange.subscribe((f) => emitted.push(f));
    const render = () => fixture.detectChanges();
    const drop = (...files: File[]) => {
      cmp.onDrop({ preventDefault: () => {}, dataTransfer: { files } } as unknown as DragEvent);
      render();
    };
    const zone = () => el.querySelector<HTMLElement>('.upload-zone')!;
    const items = () => Array.from(el.querySelectorAll<HTMLElement>('.upload-file'));
    return { fixture, cmp, el, emitted, render, drop, zone, items };
  }

  it('dropped files must match accept, by extension or by type', () => {
    const { cmp, items, drop } = setup({ multiple: true, accept: 'image/*, .PDF,text/csv' });
    drop(
      typed('a.exe', 'application/x-msdownload'),
      typed('b.pdf', 'application/pdf'),
      typed('c.png', 'image/png'),
      typed('d.csv', 'text/csv'),
      typed('e.txt', 'text/plain'),
    );
    expect(cmp.files().map((f) => f.status)).toEqual([
      'invalid',
      'valid',
      'valid',
      'valid',
      'invalid',
    ]);
    expect(cmp.files()[0].error).toBe('Tipo de archivo no permitido');
    expect(items()[0].classList).toContain('upload-file--invalid');
    expect(items()[0].textContent).toContain('Tipo de archivo no permitido');
  });

  it('an empty accept allows any file', () => {
    const { cmp, drop } = setup();
    drop(typed('a.exe', 'application/x-msdownload'));
    expect(cmp.files()[0].status).toBe('valid');
  });

  it('dragging files over the zone highlights it until they leave', () => {
    const { cmp, zone, render } = setup();
    const over = (types: string[]) =>
      cmp.onDragOver({ preventDefault: () => {}, dataTransfer: { types } } as unknown as DragEvent);
    over(['text/plain']);
    expect(cmp.isDragging()).toBe(false);
    over(['Files']);
    render();
    expect(zone().classList).toContain('upload-zone--dragging');
    const inner = zone().querySelector('.upload-label')!;
    cmp.onDragLeave({ currentTarget: zone(), relatedTarget: inner } as unknown as DragEvent);
    expect(cmp.isDragging()).toBe(true);
    cmp.onDragLeave({ currentTarget: zone(), relatedTarget: null } as unknown as DragEvent);
    expect(cmp.isDragging()).toBe(false);
  });

  it('a disabled zone ignores drag, drop and remove', () => {
    const { fixture, cmp, zone, drop, render, items, emitted } = setup();
    drop(typed('a.txt', 'text/plain'));
    fixture.componentRef.setInput('disabled', true);
    render();
    expect(zone().classList).toContain('upload-zone--disabled');
    cmp.onDragOver({
      preventDefault: () => {},
      dataTransfer: { types: ['Files'] },
    } as unknown as DragEvent);
    expect(cmp.isDragging()).toBe(false);
    drop(typed('b.txt', 'text/plain'));
    expect(cmp.files().map((f) => f.name)).toEqual(['a.txt']);
    const remove = items()[0].querySelector('button')!;
    expect(remove.disabled).toBe(true);
    cmp.removeFile(cmp.files()[0].id);
    expect(cmp.files().length).toBe(1);
    expect(emitted.length).toBe(1);
  });

  it('clearAll empties the list and emits []', () => {
    const { cmp, drop, items, render, emitted } = setup({ multiple: true });
    drop(typed('a.txt', 'text/plain'), typed('b.txt', 'text/plain'));
    cmp.clearAll();
    render();
    expect(items().length).toBe(0);
    expect(emitted.at(-1)).toEqual([]);
  });

  it('shows sizes in B, KB and MB', () => {
    const { drop, items } = setup({ multiple: true });
    drop(
      typed('a.txt', 'text/plain', 512),
      typed('b.txt', 'text/plain', 1536),
      typed('c.txt', 'text/plain', 2.5 * MB),
    );
    const meta = items().map((i) => i.querySelector('.upload-file__meta')!.textContent!.trim());
    expect(meta).toEqual(['512 B', '1.5 KB', '2.5 MB']);
  });

  it('picks an icon by file type', () => {
    const { cmp, drop } = setup({ multiple: true });
    drop(
      typed('a.png', 'image/png'),
      typed('b.mp4', 'video/mp4'),
      typed('c.pdf', 'application/pdf'),
      typed('d.txt', 'text/plain'),
      typed('e.zip', 'application/zip'),
    );
    const icon = (i: number) => cmp['fileIcon'](cmp.files()[i]);
    expect(icon(0)).toBe(FileImage);
    expect(icon(1)).toBe(FileVideo);
    expect(icon(2)).toBe(FileText);
    expect(icon(3)).toBe(FileText);
    expect(icon(4)).toBe(FileIcon);
  });

  it('renders the upload state of each file', () => {
    const { fixture, cmp, drop, items, render } = setup({ multiple: true });
    drop(typed('a.txt', 'text/plain'), typed('b.txt', 'text/plain'), typed('c.txt', 'text/plain'));
    const [a, b, c] = cmp.files().map((f) => f.id);
    fixture.componentRef.setInput('uploadState', {
      [a]: { status: 'uploading', progress: 40 },
      [b]: { status: 'done' },
      [c]: { status: 'error', error: 'Falló la subida' },
    });
    render();
    expect(items()[0].querySelector('ngx-ds-progress-bar')).not.toBeNull();
    expect(items()[1].querySelector('.upload-file__status--done')).not.toBeNull();
    expect(items()[2].classList).toContain('upload-file--error');
    expect(items()[2].querySelector('.upload-file__status--error')).not.toBeNull();
    expect(items()[2].textContent).toContain('Falló la subida');
  });

  it('shows the label and hint', () => {
    const { el } = setup({ label: 'Sube tu CV', hint: 'PDF, máx. 2 MB' });
    expect(el.querySelector('.upload-label')!.textContent!.trim()).toBe('Sube tu CV');
    expect(el.querySelector('.upload-hint')!.textContent!.trim()).toBe('PDF, máx. 2 MB');
  });
});
