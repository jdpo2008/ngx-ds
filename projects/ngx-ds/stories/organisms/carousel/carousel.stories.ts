import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { CarouselComponent } from '../../../src/lib/organisms/carousel/carousel.component';
import { CarouselItem } from '../../../src/lib/organisms/carousel/carousel.types';
import { LightboxComponent } from '../../../src/lib/organisms/lightbox/lightbox.component';

const PHOTOS: CarouselItem[] = [
  {
    src: 'https://picsum.photos/id/1015/1200/675',
    alt: 'Río entre montañas',
    caption: 'Un río atraviesa un valle entre montañas.',
  },
  {
    src: 'https://picsum.photos/id/1018/1200/675',
    alt: 'Montañas con niebla',
    caption: 'Montañas cubiertas de niebla al amanecer.',
  },
  { src: 'https://picsum.photos/id/1039/1200/675', alt: 'Cascada en el bosque' },
  {
    src: 'https://picsum.photos/id/1043/1200/675',
    alt: 'Camino junto al mar',
    caption: 'Camino de costa.',
  },
  { src: 'https://picsum.photos/id/1050/1200/675', alt: 'Acantilados sobre el océano' },
];

// ── Default ───────────────────────────────────────────────────

@Component({
  selector: 'carousel-default-wrapper',
  standalone: true,
  imports: [CarouselComponent],
  template: `
    <div style="max-width: 720px; padding: 1.5rem">
      <ngx-ds-carousel [items]="photos" [(index)]="index" />
      <p style="margin-top: 1rem; font-size: 0.875rem; color: #6b7280">Índice: {{ index() }}</p>
    </div>
  `,
})
class DefaultWrapper {
  readonly photos = PHOTOS;
  readonly index = signal(0);
}

// ── Autoplay ──────────────────────────────────────────────────

@Component({
  selector: 'carousel-autoplay-wrapper',
  standalone: true,
  imports: [CarouselComponent],
  template: `
    <div style="max-width: 720px; padding: 1.5rem">
      <ngx-ds-carousel [items]="photos" [autoplay]="3000" ariaLabel="Destacados" />
    </div>
  `,
})
class AutoplayWrapper {
  readonly photos = PHOTOS;
}

// ── No loop, contain ──────────────────────────────────────────

@Component({
  selector: 'carousel-contain-wrapper',
  standalone: true,
  imports: [CarouselComponent],
  template: `
    <div style="max-width: 480px; padding: 1.5rem">
      <ngx-ds-carousel [items]="photos" [loop]="false" aspectRatio="1 / 1" fit="contain" />
    </div>
  `,
})
class ContainWrapper {
  readonly photos = PHOTOS;
}

// ── With Lightbox ─────────────────────────────────────────────

@Component({
  selector: 'carousel-lightbox-wrapper',
  standalone: true,
  imports: [CarouselComponent, LightboxComponent],
  template: `
    <div style="max-width: 720px; padding: 1.5rem">
      <ngx-ds-carousel [items]="photos" [(index)]="index" (itemClick)="open.set(true)" />
      <p style="margin-top: 0.5rem; font-size: 0.875rem; color: #6b7280">
        Haz clic en una imagen para verla a pantalla completa.
      </p>
      <ngx-ds-lightbox [items]="photos" [(open)]="open" [(index)]="index" />
    </div>
  `,
})
class LightboxWrapper {
  readonly photos = PHOTOS;
  readonly index = signal(0);
  readonly open = signal(false);
}

// ── Gallery grid + Lightbox ───────────────────────────────────

@Component({
  selector: 'lightbox-gallery-wrapper',
  standalone: true,
  imports: [LightboxComponent],
  template: `
    <div
      style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.5rem; max-width: 720px; padding: 1.5rem"
    >
      @for (p of photos; track p.src; let i = $index) {
        <button
          type="button"
          style="padding: 0; border: none; border-radius: 0.5rem; overflow: hidden; cursor: zoom-in"
          (click)="show(i)"
        >
          <img
            [src]="p.src"
            [alt]="p.alt"
            style="display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover"
          />
        </button>
      }
    </div>
    <ngx-ds-lightbox [items]="photos" [(open)]="open" [(index)]="index" />
  `,
})
class GalleryWrapper {
  readonly photos = PHOTOS;
  readonly index = signal(0);
  readonly open = signal(false);

  show(i: number): void {
    this.index.set(i);
    this.open.set(true);
  }
}

const meta: Meta = {
  title: 'Organisms/Carousel',
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<carousel-default-wrapper />`,
    moduleMetadata: { imports: [DefaultWrapper] },
  }),
};

export const Autoplay: Story = {
  render: () => ({
    template: `<carousel-autoplay-wrapper />`,
    moduleMetadata: { imports: [AutoplayWrapper] },
  }),
};

export const NoLoopContain: Story = {
  render: () => ({
    template: `<carousel-contain-wrapper />`,
    moduleMetadata: { imports: [ContainWrapper] },
  }),
};

export const WithLightbox: Story = {
  render: () => ({
    template: `<carousel-lightbox-wrapper />`,
    moduleMetadata: { imports: [LightboxWrapper] },
  }),
};

export const LightboxGallery: Story = {
  render: () => ({
    template: `<lightbox-gallery-wrapper />`,
    moduleMetadata: { imports: [GalleryWrapper] },
  }),
};
