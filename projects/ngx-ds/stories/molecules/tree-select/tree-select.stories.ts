import { Meta, StoryObj } from '@storybook/angular';
import { Component, afterNextRender, viewChild } from '@angular/core';
import {
  TreeSelectComponent,
  TreeSelectId,
  TreeSelectNode,
  TreeSelectValue,
} from '../../../src/lib/molecules/tree-select/tree-select.component';

const DEPARTMENTS: TreeSelectNode[] = [
  {
    id: 'eng',
    label: 'Ingeniería',
    children: [
      {
        id: 'web',
        label: 'Web',
        children: [
          { id: 'frontend', label: 'Frontend' },
          { id: 'backend', label: 'Backend' },
        ],
      },
      { id: 'mobile', label: 'Móvil' },
      { id: 'qa', label: 'QA', disabled: true },
    ],
  },
  {
    id: 'sales',
    label: 'Ventas',
    children: [
      { id: 'emea', label: 'EMEA' },
      { id: 'latam', label: 'LATAM' },
    ],
  },
  { id: 'hr', label: 'Personas' },
  { id: 'finance', label: 'Finanzas' },
];

const meta: Meta = {
  title: 'Molecules/TreeSelect',
};

export default meta;
type Story = StoryObj;

function story(selector: string, wrapper: unknown): Story {
  return {
    render: () => ({ template: `<${selector} />`, moduleMetadata: { imports: [wrapper] } }),
  };
}

@Component({
  selector: 'tree-select-default-wrapper',
  standalone: true,
  imports: [TreeSelectComponent],
  template: `
    <div class="p-6" style="max-width:360px;">
      <ngx-ds-tree-select
        label="Departamento"
        placeholder="Elige un departamento"
        [nodes]="nodes"
        [(value)]="value"
        hint="Los grupos se despliegan; elige un equipo"
      />
      <p style="margin-top:1rem;font-size:0.8125rem;color:var(--text-muted, #6b7280);">
        Valor: {{ value ?? '—' }}
      </p>
    </div>
  `,
})
class DefaultWrapper {
  nodes = DEPARTMENTS;
  value: TreeSelectValue = 'frontend';
}

@Component({
  selector: 'tree-select-multiple-wrapper',
  standalone: true,
  imports: [TreeSelectComponent],
  template: `
    <div class="p-6" style="display:flex; flex-direction:column; gap:1.5rem; max-width:360px;">
      <ngx-ds-tree-select
        label="Equipos (en cascada)"
        [nodes]="nodes"
        [multiple]="true"
        [searchable]="true"
        [(value)]="cascade"
      />
      <ngx-ds-tree-select
        label="Nodos sueltos"
        [nodes]="nodes"
        [multiple]="true"
        [cascade]="false"
        [(value)]="loose"
        hint="Sin cascada, cada nodo se marca por separado"
      />
    </div>
  `,
})
class MultipleWrapper {
  nodes = DEPARTMENTS;
  cascade: TreeSelectValue = ['frontend', 'backend', 'emea'];
  loose: TreeSelectValue = ['eng'];
}

@Component({
  selector: 'tree-select-open-wrapper',
  standalone: true,
  imports: [TreeSelectComponent],
  template: `
    <div class="p-6" style="max-width:360px; min-height:24rem;">
      <ngx-ds-tree-select
        label="Equipos"
        [nodes]="nodes"
        [multiple]="true"
        [searchable]="true"
        [(value)]="value"
        [(expanded)]="expanded"
      />
    </div>
  `,
})
class OpenWrapper {
  nodes = DEPARTMENTS;
  value: TreeSelectValue = ['frontend', 'mobile'];
  expanded: TreeSelectId[] = ['eng', 'web', 'sales'];
  private readonly select = viewChild.required(TreeSelectComponent);

  constructor() {
    afterNextRender(() => this.select().open());
  }
}

@Component({
  selector: 'tree-select-parents-wrapper',
  standalone: true,
  imports: [TreeSelectComponent],
  template: `
    <div class="p-6" style="max-width:360px;">
      <ngx-ds-tree-select
        label="Área"
        [nodes]="nodes"
        [selectableParents]="true"
        [searchable]="true"
        [(value)]="value"
        hint="Los grupos también se pueden elegir"
      />
    </div>
  `,
})
class ParentsWrapper {
  nodes = DEPARTMENTS;
  value: TreeSelectValue = 'sales';
}

@Component({
  selector: 'tree-select-states-wrapper',
  standalone: true,
  imports: [TreeSelectComponent],
  template: `
    <div class="p-6" style="display:flex; flex-direction:column; gap:1.5rem; max-width:360px;">
      <ngx-ds-tree-select label="Pequeño" size="sm" [nodes]="nodes" />
      <ngx-ds-tree-select label="Grande" size="lg" [nodes]="nodes" />
      <ngx-ds-tree-select
        label="Con error"
        [nodes]="nodes"
        errorMessage="Elige al menos un departamento"
      />
      <ngx-ds-tree-select label="Deshabilitado" [nodes]="nodes" value="hr" [disabled]="true" />
    </div>
  `,
})
class StatesWrapper {
  nodes = DEPARTMENTS;
}

export const Default = story('tree-select-default-wrapper', DefaultWrapper);
export const Multiple = story('tree-select-multiple-wrapper', MultipleWrapper);
export const Open = story('tree-select-open-wrapper', OpenWrapper);
export const SelectableParents = story('tree-select-parents-wrapper', ParentsWrapper);
export const States = story('tree-select-states-wrapper', StatesWrapper);
