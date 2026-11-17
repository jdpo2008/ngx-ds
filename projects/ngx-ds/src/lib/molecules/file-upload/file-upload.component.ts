import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  inject,
} from '@angular/core';
import {
  File as FileIcon,
  FileImage,
  FileText,
  FileVideo,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { IconButtonComponent } from '../../atoms/icon-button/icon-button.component';
import { ProgressBarComponent } from '../../atoms/progress-bar/progress-bar.component';
import { NGX_DS_LABELS } from '../../shared/labels';

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: 'valid' | 'invalid';
  error?: string;
}

export type FileUploadStatus = 'uploading' | 'done' | 'error';

export interface FileUploadState {
  status: FileUploadStatus;
  progress?: number;
  error?: string;
}

@Component({
  selector: 'ngx-ds-file-upload',
  standalone: true,
  imports: [IconComponent, IconButtonComponent, ProgressBarComponent],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'file-upload-host' },
})
export class FileUploadComponent {
  readonly i18n = inject(NGX_DS_LABELS);

  // ── Inputs ───────────────────────────────────────────────────────────────
  readonly multiple = input<boolean>(false);
  readonly accept = input<string>('');
  readonly maxSizeMb = input<number | undefined>(undefined);
  readonly maxFiles = input<number | undefined>(undefined);
  readonly disabled = input<boolean>(false);
  readonly label = input<string | undefined>(undefined);
  readonly hint = input<string>('');
  readonly uploadState = input<Record<string, FileUploadState>>({});

  // ── Outputs ──────────────────────────────────────────────────────────────
  readonly filesChange = output<UploadedFile[]>();

  // ── State ─────────────────────────────────────────────────────────────────
  readonly files = signal<UploadedFile[]>([]);
  readonly isDragging = signal(false);

  // ── Icons ─────────────────────────────────────────────────────────────────
  protected readonly icons = { Upload, X, CheckCircle2, AlertCircle };

  // ── Derived ──────────────────────────────────────────────────────────────
  readonly zoneClasses = computed(() => {
    const c = ['upload-zone'];
    if (this.isDragging()) c.push('upload-zone--dragging');
    if (this.disabled()) c.push('upload-zone--disabled');
    return c.join(' ');
  });

  // ── Drag handlers ─────────────────────────────────────────────────────────

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    if (this.disabled()) return;
    if (e.dataTransfer?.types.includes('Files')) this.isDragging.set(true);
  }

  onDragLeave(e: DragEvent): void {
    const target = e.currentTarget as HTMLElement;
    const related = e.relatedTarget as Node | null;
    if (!related || !target.contains(related)) this.isDragging.set(false);
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragging.set(false);
    if (this.disabled()) return;
    const dt = e.dataTransfer;
    if (dt?.files?.length) this.addFiles(Array.from(dt.files));
  }

  // ── File selection ────────────────────────────────────────────────────────

  onFileSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files?.length) this.addFiles(Array.from(input.files));
    input.value = '';
  }

  private addFiles(rawFiles: File[]): void {
    const maxFiles = this.maxFiles();
    let incoming = rawFiles.map((f) => this.validateFile(f));

    if (!this.multiple()) {
      this.files.set([incoming[0]]);
    } else {
      if (maxFiles !== undefined) {
        const remaining = maxFiles - this.files().length;
        incoming = incoming.slice(0, Math.max(0, remaining));
      }
      this.files.update((prev) => [...prev, ...incoming]);
    }

    this.filesChange.emit(this.files());
  }

  private validateFile(file: File): UploadedFile {
    const maxSizeMb = this.maxSizeMb();
    let error: string | undefined;

    if (maxSizeMb !== undefined && file.size > maxSizeMb * 1024 * 1024) {
      error = this.i18n.fileTooLarge(maxSizeMb);
    }

    return {
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: error ? 'invalid' : 'valid',
      error,
    };
  }

  // ── Remove ────────────────────────────────────────────────────────────────

  removeFile(id: string): void {
    this.files.update((list) => list.filter((f) => f.id !== id));
    this.filesChange.emit(this.files());
  }

  clearAll(): void {
    this.files.set([]);
    this.filesChange.emit([]);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  protected formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  protected fileIcon(file: UploadedFile) {
    const t = file.type;
    if (t.startsWith('image/')) return FileImage;
    if (t.startsWith('video/')) return FileVideo;
    if (t.includes('pdf') || t.startsWith('text/')) return FileText;
    return FileIcon;
  }

  protected stateFor(file: UploadedFile): FileUploadState | undefined {
    return this.uploadState()[file.id];
  }
}
