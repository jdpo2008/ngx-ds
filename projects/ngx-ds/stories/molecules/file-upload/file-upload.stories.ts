import { Meta, StoryObj } from '@storybook/angular';
import { Component, OnDestroy, signal } from '@angular/core';
import {
  FileUploadComponent,
  FileUploadState,
  UploadedFile,
} from '../../../src/lib/molecules/file-upload/file-upload.component';

// ── Basic Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'upload-basic-wrapper',
  standalone: true,
  imports: [FileUploadComponent],
  template: `
    <div class="p-6" style="max-width: 32rem;">
      <ngx-ds-file-upload
        hint="Cualquier tipo de archivo, máximo 5 MB"
        [maxSizeMb]="5"
        (filesChange)="onFiles($event)"
      />
      @if (files.length > 0) {
        <p class="text-xs text-gray-400 mt-3">{{ files.length }} archivo(s) seleccionado(s)</p>
      }
    </div>
  `,
})
class BasicWrapper {
  files: UploadedFile[] = [];
  onFiles(f: UploadedFile[]): void {
    this.files = f;
  }
}

// ── Multiple Wrapper ──────────────────────────────────────────────────────────

@Component({
  selector: 'upload-multiple-wrapper',
  standalone: true,
  imports: [FileUploadComponent],
  template: `
    <div class="p-6" style="max-width: 32rem;">
      <p class="text-sm text-gray-500 mb-3">
        Selección múltiple — máximo 5 archivos, 10 MB cada uno
      </p>
      <ngx-ds-file-upload
        [multiple]="true"
        [maxSizeMb]="10"
        [maxFiles]="5"
        label="Arrastra hasta 5 archivos o haz clic para seleccionar"
        hint="Máximo 5 archivos · 10 MB por archivo"
      />
    </div>
  `,
})
class MultipleWrapper {}

// ── Images Only Wrapper ───────────────────────────────────────────────────────

@Component({
  selector: 'upload-images-wrapper',
  standalone: true,
  imports: [FileUploadComponent],
  template: `
    <div class="p-6" style="max-width: 32rem;">
      <p class="text-sm text-gray-500 mb-3">Solo imágenes</p>
      <ngx-ds-file-upload
        [multiple]="true"
        accept="image/*"
        [maxSizeMb]="8"
        [maxFiles]="10"
        label="Arrastra imágenes o haz clic para seleccionar"
        hint="PNG, JPG, GIF, WEBP · máximo 8 MB por imagen"
      />
    </div>
  `,
})
class ImagesWrapper {}

// ── Documents Wrapper ─────────────────────────────────────────────────────────

@Component({
  selector: 'upload-documents-wrapper',
  standalone: true,
  imports: [FileUploadComponent],
  template: `
    <div class="p-6" style="max-width: 32rem;">
      <p class="text-sm text-gray-500 mb-3">Solo documentos (PDF y Word)</p>
      <ngx-ds-file-upload
        [multiple]="true"
        accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        [maxSizeMb]="25"
        [maxFiles]="3"
        label="Arrastra tus documentos o haz clic para seleccionar"
        hint="PDF, DOC, DOCX · máximo 25 MB · hasta 3 documentos"
      />
    </div>
  `,
})
class DocumentsWrapper {}

// ── Disabled Wrapper ──────────────────────────────────────────────────────────

@Component({
  selector: 'upload-disabled-wrapper',
  standalone: true,
  imports: [FileUploadComponent],
  template: `
    <div class="p-6" style="max-width: 32rem;">
      <p class="text-sm text-gray-500 mb-3">Estado deshabilitado</p>
      <ngx-ds-file-upload
        [disabled]="true"
        label="Carga de archivos no disponible"
        hint="Completa los pasos anteriores para habilitar esta sección"
      />
    </div>
  `,
})
class DisabledWrapper {}

// ── With Progress Wrapper ─────────────────────────────────────────────────────

@Component({
  selector: 'upload-progress-wrapper',
  standalone: true,
  imports: [FileUploadComponent],
  template: `
    <div class="p-6" style="max-width: 32rem;">
      <p class="text-sm text-gray-500 mb-3">
        Simulación de subida — el estado se refleja externamente vía [uploadState]
      </p>
      <ngx-ds-file-upload
        [multiple]="true"
        label="Arrastra archivos para simular su subida"
        [uploadState]="uploadState()"
        (filesChange)="onFiles($event)"
      />
    </div>
  `,
})
class ProgressWrapper implements OnDestroy {
  uploadState = signal<Record<string, FileUploadState>>({});
  private timers = new Map<string, ReturnType<typeof setInterval>>();

  onFiles(files: UploadedFile[]): void {
    for (const file of files) {
      if (this.uploadState()[file.id] || this.timers.has(file.id)) continue;
      this.simulateUpload(file.id);
    }
  }

  private simulateUpload(id: string): void {
    this.uploadState.update((s) => ({ ...s, [id]: { status: 'uploading', progress: 0 } }));

    const timer = setInterval(() => {
      const current = this.uploadState()[id];
      const next = Math.min(100, (current?.progress ?? 0) + Math.floor(Math.random() * 15) + 5);

      if (next >= 100) {
        const failed = Math.random() < 0.15;
        this.uploadState.update((s) => ({
          ...s,
          [id]: failed
            ? { status: 'error', error: 'No se pudo completar la subida' }
            : { status: 'done', progress: 100 },
        }));
        clearInterval(timer);
        this.timers.delete(id);
      } else {
        this.uploadState.update((s) => ({ ...s, [id]: { status: 'uploading', progress: next } }));
      }
    }, 400);

    this.timers.set(id, timer);
  }

  ngOnDestroy(): void {
    this.timers.forEach((t) => clearInterval(t));
  }
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Molecules/FileUpload',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    multiple: false,
    maxSizeMb: 5,
    disabled: false,
    label: 'Arrastra archivos aquí o haz clic para seleccionar',
    hint: 'Cualquier archivo hasta 5 MB',
  },
  argTypes: {
    multiple: { control: 'boolean' },
    maxSizeMb: { control: 'number' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    hint: { control: 'text' },
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 1.5rem; max-width: 32rem;">
        <ngx-ds-file-upload
          [multiple]="multiple"
          [maxSizeMb]="maxSizeMb"
          [disabled]="disabled"
          [label]="label"
          [hint]="hint"
        />
      </div>
    `,
    moduleMetadata: { imports: [FileUploadComponent] },
  }),
};

export const SingleFile: Story = {
  render: () => ({
    template: `<upload-basic-wrapper />`,
    moduleMetadata: { imports: [BasicWrapper] },
  }),
};

export const MultipleFiles: Story = {
  render: () => ({
    template: `<upload-multiple-wrapper />`,
    moduleMetadata: { imports: [MultipleWrapper] },
  }),
};

export const ImagesOnly: Story = {
  render: () => ({
    template: `<upload-images-wrapper />`,
    moduleMetadata: { imports: [ImagesWrapper] },
  }),
};

export const DocumentsOnly: Story = {
  render: () => ({
    template: `<upload-documents-wrapper />`,
    moduleMetadata: { imports: [DocumentsWrapper] },
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `<upload-disabled-wrapper />`,
    moduleMetadata: { imports: [DisabledWrapper] },
  }),
};

export const WithProgress: Story = {
  render: () => ({
    template: `<upload-progress-wrapper />`,
    moduleMetadata: { imports: [ProgressWrapper] },
  }),
};
