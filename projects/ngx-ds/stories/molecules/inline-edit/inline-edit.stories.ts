import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { InlineEditComponent } from '../../../src/lib/molecules/inline-edit/inline-edit.component';

@Component({
  selector: 'ie-basic-wrapper',
  standalone: true,
  imports: [InlineEditComponent],
  template: `
    <div style="padding:1.5rem; display:flex; flex-direction:column; gap:1rem; max-width:28rem;">
      <ngx-ds-inline-edit label="Título" [(value)]="title" (saved)="last.set($event)" />
      <ngx-ds-inline-edit label="Responsable" placeholder="Sin asignar" [(value)]="owner" />
      <p style="font-size:0.8rem; color:var(--text-muted, #6b7280);">
        Último guardado: {{ last() || '—' }}
      </p>
    </div>
  `,
})
class BasicWrapper {
  title = signal('Informe trimestral');
  owner = signal('');
  last = signal('');
}

@Component({
  selector: 'ie-sizes-wrapper',
  standalone: true,
  imports: [InlineEditComponent],
  template: `
    <div style="padding:1.5rem; display:flex; flex-direction:column; gap:1rem; max-width:28rem;">
      <ngx-ds-inline-edit label="Pequeño" size="sm" value="Tamaño sm" />
      <ngx-ds-inline-edit label="Mediano" size="md" value="Tamaño md" />
      <ngx-ds-inline-edit label="Grande" size="lg" value="Tamaño lg" />
    </div>
  `,
})
class SizesWrapper {}

@Component({
  selector: 'ie-actions-wrapper',
  standalone: true,
  imports: [InlineEditComponent],
  template: `
    <div style="padding:1.5rem; display:flex; flex-direction:column; gap:1.5rem; max-width:28rem;">
      <ngx-ds-inline-edit
        label="Nombre del proyecto"
        [showActions]="true"
        [saveOnBlur]="false"
        [required]="true"
        [(value)]="name"
      />
      <ngx-ds-inline-edit
        label="Descripción"
        [multiline]="true"
        [showActions]="true"
        placeholder="Añade una descripción (Ctrl+Enter para guardar)"
        [(value)]="description"
      />
      <ngx-ds-inline-edit label="Bloqueado" value="No editable" [disabled]="true" />
    </div>
  `,
})
class ActionsWrapper {
  name = signal('Rediseño web');
  description = signal('');
}

@Component({
  selector: 'ie-editing-wrapper',
  standalone: true,
  imports: [InlineEditComponent],
  template: `
    <div style="padding:1.5rem; max-width:28rem;">
      <ngx-ds-inline-edit
        label="Título"
        value="Informe trimestral"
        [editing]="true"
        [showActions]="true"
      />
    </div>
  `,
})
class EditingWrapper {}

@Component({
  selector: 'ie-forms-wrapper',
  standalone: true,
  imports: [InlineEditComponent, ReactiveFormsModule],
  template: `
    <div style="padding:1.5rem; display:flex; flex-direction:column; gap:1rem; max-width:28rem;">
      <ngx-ds-inline-edit label="Email" [required]="true" [formControl]="email" />
      <p style="font-size:0.8rem; color:var(--text-muted, #6b7280);">
        Valor: {{ email.value }} · {{ email.touched ? 'touched' : 'untouched' }}
      </p>
    </div>
  `,
})
class FormsWrapper {
  email = new FormControl('ana@example.com', { nonNullable: true, validators: Validators.email });
}

const meta: Meta = { title: 'Molecules/InlineEdit' };
export default meta;
type Story = StoryObj;

const story = (selector: string, wrapper: unknown): Story => ({
  render: () => ({ template: `<${selector} />`, moduleMetadata: { imports: [wrapper] } }),
});

export const Default = story('ie-basic-wrapper', BasicWrapper);
export const Sizes = story('ie-sizes-wrapper', SizesWrapper);
export const WithActions = story('ie-actions-wrapper', ActionsWrapper);
export const Editing = story('ie-editing-wrapper', EditingWrapper);
export const ReactiveForms = story('ie-forms-wrapper', FormsWrapper);
