import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import {
  AccordionComponent,
  AccordionItemComponent,
  AccordionVariant,
  AccordionSize,
} from '../../../src/lib/organisms/accordion';
import { HelpCircle, Settings, User, Shield, CreditCard } from 'lucide-angular';

// ── FAQ Wrapper ───────────────────────────────────────────────────────────────

@Component({
  selector: 'accordion-faq-wrapper',
  standalone: true,
  imports: [AccordionComponent, AccordionItemComponent],
  template: `
    <div class="p-6" style="max-width: 38rem;">
      <p class="text-sm text-gray-500 mb-4">
        Un solo panel abierto a la vez (comportamiento por defecto)
      </p>
      <ngx-ds-accordion>
        <ngx-ds-accordion-item label="¿Qué incluye el plan básico?">
          El plan básico incluye acceso a todas las funcionalidades esenciales: gestión de usuarios,
          reportes mensuales y hasta 5 proyectos activos. Ideal para equipos pequeños.
        </ngx-ds-accordion-item>
        <ngx-ds-accordion-item label="¿Puedo cambiar de plan en cualquier momento?">
          Sí, puedes actualizar o degradar tu plan en cualquier momento desde la configuración de tu
          cuenta. Los cambios se aplican de forma proporcional al ciclo de facturación.
        </ngx-ds-accordion-item>
        <ngx-ds-accordion-item label="¿Ofrecen descuentos anuales?">
          Sí, al suscribirte anualmente obtienes un descuento del 20% sobre el precio mensual. El
          pago se realiza de una sola vez al inicio del periodo.
        </ngx-ds-accordion-item>
        <ngx-ds-accordion-item label="¿Qué métodos de pago aceptan?" [disabled]="true">
          Aceptamos tarjetas de crédito/débito Visa, Mastercard y American Express, además de
          transferencias bancarias para planes empresariales.
        </ngx-ds-accordion-item>
      </ngx-ds-accordion>
    </div>
  `,
})
class FaqWrapper {}

// ── Multiple Wrapper ──────────────────────────────────────────────────────────

@Component({
  selector: 'accordion-multiple-wrapper',
  standalone: true,
  imports: [AccordionComponent, AccordionItemComponent],
  template: `
    <div class="p-6" style="max-width: 38rem;">
      <p class="text-sm text-gray-500 mb-4">
        Múltiples paneles pueden estar abiertos simultáneamente
      </p>
      <ngx-ds-accordion [multiple]="true">
        <ngx-ds-accordion-item
          label="Características principales"
          description="Lo que puedes hacer"
        >
          Gestión centralizada de recursos, automatización de flujos de trabajo, integraciones con
          herramientas de terceros y análisis avanzado de datos.
        </ngx-ds-accordion-item>
        <ngx-ds-accordion-item
          label="Seguridad y privacidad"
          description="Cómo protegemos tus datos"
        >
          Todos los datos se cifran en tránsito (TLS 1.3) y en reposo (AES-256). Cumplimos con GDPR,
          SOC 2 Tipo II y realizamos auditorías de seguridad periódicas.
        </ngx-ds-accordion-item>
        <ngx-ds-accordion-item label="Soporte técnico" description="Cómo contactarnos">
          Soporte 24/7 vía chat en vivo para planes Pro y Enterprise. Los planes básicos incluyen
          soporte por email con respuesta en menos de 48 horas hábiles.
        </ngx-ds-accordion-item>
      </ngx-ds-accordion>
    </div>
  `,
})
class MultipleWrapper {}

// ── Variants Wrapper ──────────────────────────────────────────────────────────

@Component({
  selector: 'accordion-variants-wrapper',
  standalone: true,
  imports: [AccordionComponent, AccordionItemComponent],
  template: `
    <div class="p-6" style="max-width: 38rem; display: flex; flex-direction: column; gap: 2.5rem;">
      <div>
        <p class="text-xs text-gray-400 mb-2 font-medium">
          Default — tarjetas con borde individual
        </p>
        <ngx-ds-accordion variant="default">
          <ngx-ds-accordion-item label="Primer elemento"
            >Contenido del primer elemento.</ngx-ds-accordion-item
          >
          <ngx-ds-accordion-item label="Segundo elemento"
            >Contenido del segundo elemento.</ngx-ds-accordion-item
          >
          <ngx-ds-accordion-item label="Tercer elemento"
            >Contenido del tercer elemento.</ngx-ds-accordion-item
          >
        </ngx-ds-accordion>
      </div>

      <div>
        <p class="text-xs text-gray-400 mb-2 font-medium">
          Flush — separadores, borde exterior compartido
        </p>
        <ngx-ds-accordion variant="flush">
          <ngx-ds-accordion-item label="Primer elemento"
            >Contenido del primer elemento.</ngx-ds-accordion-item
          >
          <ngx-ds-accordion-item label="Segundo elemento"
            >Contenido del segundo elemento.</ngx-ds-accordion-item
          >
          <ngx-ds-accordion-item label="Tercer elemento"
            >Contenido del tercer elemento.</ngx-ds-accordion-item
          >
        </ngx-ds-accordion>
      </div>

      <div>
        <p class="text-xs text-gray-400 mb-2 font-medium">Ghost — sin bordes, fondo en hover</p>
        <ngx-ds-accordion variant="ghost">
          <ngx-ds-accordion-item label="Primer elemento"
            >Contenido del primer elemento.</ngx-ds-accordion-item
          >
          <ngx-ds-accordion-item label="Segundo elemento"
            >Contenido del segundo elemento.</ngx-ds-accordion-item
          >
          <ngx-ds-accordion-item label="Tercer elemento"
            >Contenido del tercer elemento.</ngx-ds-accordion-item
          >
        </ngx-ds-accordion>
      </div>
    </div>
  `,
})
class VariantsWrapper {}

// ── Sizes Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'accordion-sizes-wrapper',
  standalone: true,
  imports: [AccordionComponent, AccordionItemComponent],
  template: `
    <div class="p-6" style="max-width: 38rem; display: flex; flex-direction: column; gap: 2rem;">
      <div>
        <p class="text-xs text-gray-400 mb-2">Small</p>
        <ngx-ds-accordion size="sm">
          <ngx-ds-accordion-item label="Elemento sm">Contenido pequeño.</ngx-ds-accordion-item>
          <ngx-ds-accordion-item label="Otro elemento sm"
            >Más contenido pequeño.</ngx-ds-accordion-item
          >
        </ngx-ds-accordion>
      </div>
      <div>
        <p class="text-xs text-gray-400 mb-2">Medium (default)</p>
        <ngx-ds-accordion size="md">
          <ngx-ds-accordion-item label="Elemento md">Contenido mediano.</ngx-ds-accordion-item>
          <ngx-ds-accordion-item label="Otro elemento md"
            >Más contenido mediano.</ngx-ds-accordion-item
          >
        </ngx-ds-accordion>
      </div>
      <div>
        <p class="text-xs text-gray-400 mb-2">Large</p>
        <ngx-ds-accordion size="lg">
          <ngx-ds-accordion-item label="Elemento lg">Contenido grande.</ngx-ds-accordion-item>
          <ngx-ds-accordion-item label="Otro elemento lg"
            >Más contenido grande.</ngx-ds-accordion-item
          >
        </ngx-ds-accordion>
      </div>
    </div>
  `,
})
class SizesWrapper {}

// ── With Icons Wrapper ────────────────────────────────────────────────────────

@Component({
  selector: 'accordion-icons-wrapper',
  standalone: true,
  imports: [AccordionComponent, AccordionItemComponent],
  template: `
    <div class="p-6" style="max-width: 38rem;">
      <ngx-ds-accordion>
        <ngx-ds-accordion-item
          label="Perfil de usuario"
          description="Gestiona tu información personal"
          [icon]="icons.User"
        >
          Actualiza tu nombre, foto de perfil, dirección de email y preferencias de notificación
          desde esta sección.
        </ngx-ds-accordion-item>
        <ngx-ds-accordion-item
          label="Seguridad"
          description="Contraseña y autenticación"
          [icon]="icons.Shield"
        >
          Cambia tu contraseña, activa la autenticación en dos pasos y revisa los dispositivos con
          sesión activa.
        </ngx-ds-accordion-item>
        <ngx-ds-accordion-item
          label="Facturación"
          description="Métodos de pago y facturas"
          [icon]="icons.CreditCard"
        >
          Administra tus métodos de pago, descarga facturas anteriores y actualiza los datos de
          facturación de tu organización.
        </ngx-ds-accordion-item>
        <ngx-ds-accordion-item
          label="Configuración avanzada"
          description="Opciones avanzadas del sistema"
          [icon]="icons.Settings"
        >
          Configura las integraciones de API, webhooks, límites de uso y opciones avanzadas de la
          plataforma.
        </ngx-ds-accordion-item>
      </ngx-ds-accordion>
    </div>
  `,
})
class IconsWrapper {
  readonly icons = { User, Shield, CreditCard, Settings };
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Organisms/Accordion',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    variant: 'default' as AccordionVariant,
    size: 'md' as AccordionSize,
    multiple: false,
  },
  argTypes: {
    variant: { control: 'radio', options: ['default', 'flush', 'ghost'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    multiple: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 1.5rem; max-width: 38rem;">
        <ngx-ds-accordion [variant]="variant" [size]="size" [multiple]="multiple">
          <ngx-ds-accordion-item label="¿Qué es Angular?">
            Angular es un framework de desarrollo web de código abierto mantenido por Google.
            Permite crear aplicaciones web de una sola página (SPA) con TypeScript.
          </ngx-ds-accordion-item>
          <ngx-ds-accordion-item label="¿Qué son los signals?" description="Nuevo sistema reactivo">
            Los signals son primitivos reactivos introducidos en Angular 16 que permiten
            manejar el estado de forma más predecible y eficiente.
          </ngx-ds-accordion-item>
          <ngx-ds-accordion-item label="¿Qué es standalone?" description="Sin NgModules">
            Los componentes standalone no necesitan ser declarados en un NgModule.
            Se importan directamente en la metadata del componente que los usa.
          </ngx-ds-accordion-item>
          <ngx-ds-accordion-item label="Elemento deshabilitado" [disabled]="true">
            Este panel no se puede abrir porque está deshabilitado.
          </ngx-ds-accordion-item>
        </ngx-ds-accordion>
      </div>
    `,
    moduleMetadata: { imports: [AccordionComponent, AccordionItemComponent] },
  }),
};

export const FAQ: Story = {
  render: () => ({
    template: `<accordion-faq-wrapper />`,
    moduleMetadata: { imports: [FaqWrapper] },
  }),
};

export const Multiple: Story = {
  render: () => ({
    template: `<accordion-multiple-wrapper />`,
    moduleMetadata: { imports: [MultipleWrapper] },
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `<accordion-variants-wrapper />`,
    moduleMetadata: { imports: [VariantsWrapper] },
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `<accordion-sizes-wrapper />`,
    moduleMetadata: { imports: [SizesWrapper] },
  }),
};

export const WithIcons: Story = {
  render: () => ({
    template: `<accordion-icons-wrapper />`,
    moduleMetadata: { imports: [IconsWrapper] },
  }),
};
