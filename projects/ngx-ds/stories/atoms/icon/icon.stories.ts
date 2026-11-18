import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { IconComponent } from '../../../src/lib/atoms/icon/icon.component';
import {
  // Actions
  Plus,
  Minus,
  X,
  Check,
  Pencil,
  Trash2,
  Save,
  Copy,
  Search,
  Filter,
  SlidersHorizontal,
  // Navigation & Arrows
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  MoveUpRight,
  CornerUpLeft,
  // Feedback
  Info,
  AlertCircle,
  AlertTriangle,
  CircleCheck,
  CircleX,
  HelpCircle,
  // Communication
  Mail,
  MessageCircle,
  Phone,
  Bell,
  BellOff,
  Send,
  // Files & Folders
  File,
  FileText,
  Folder,
  FolderOpen,
  Upload,
  Download,
  Paperclip,
  // User & Auth
  User,
  Users,
  UserCheck,
  UserX,
  LogIn,
  LogOut,
  Lock,
  Unlock,
  ShieldCheck,
  // Media
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Image,
  Camera,
  Mic,
  MicOff,
  // System & Settings
  Settings,
  Settings2,
  Sliders,
  LayoutDashboard,
  LayoutGrid,
  List,
  Table2,
  // Misc
  Heart,
  Star,
  Bookmark,
  Tag,
  Globe,
  Link,
  ExternalLink,
  RefreshCw,
  RotateCcw,
  Clock,
} from 'lucide-angular';

// ── Default Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'icon-default-wrapper',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="p-6 flex items-center gap-4">
      <ngx-ds-icon [icon]="icon" [size]="size" [color]="color" [strokeWidth]="strokeWidth" />
      <span class="text-sm text-gray-500">Plus — {{ size }}px — strokeWidth {{ strokeWidth }}</span>
    </div>
  `,
})
class DefaultWrapper {
  readonly icon = Plus;
  size = 24;
  color = 'currentColor';
  strokeWidth = 2;
}

// ── Sizes Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'icon-sizes-wrapper',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="p-6 space-y-6">
      <div>
        <p class="text-sm text-gray-500 mb-4">Tamaños disponibles</p>
        <div class="flex flex-wrap items-end gap-6">
          <div class="flex flex-col items-center gap-2">
            <ngx-ds-icon [icon]="icon" [size]="12" />
            <span class="text-xs text-gray-500">12px</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <ngx-ds-icon [icon]="icon" [size]="16" />
            <span class="text-xs text-gray-500">16px</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <ngx-ds-icon [icon]="icon" [size]="20" />
            <span class="text-xs text-gray-500">20px</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <ngx-ds-icon [icon]="icon" [size]="24" />
            <span class="text-xs text-gray-500">24px</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <ngx-ds-icon [icon]="icon" [size]="32" />
            <span class="text-xs text-gray-500">32px</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <ngx-ds-icon [icon]="icon" [size]="48" />
            <span class="text-xs text-gray-500">48px</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <ngx-ds-icon [icon]="icon" [size]="64" />
            <span class="text-xs text-gray-500">64px</span>
          </div>
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-4">Stroke width</p>
        <div class="flex flex-wrap items-end gap-6">
          <div class="flex flex-col items-center gap-2">
            <ngx-ds-icon [icon]="icon" [size]="32" [strokeWidth]="1" />
            <span class="text-xs text-gray-500">1</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <ngx-ds-icon [icon]="icon" [size]="32" [strokeWidth]="1.5" />
            <span class="text-xs text-gray-500">1.5</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <ngx-ds-icon [icon]="icon" [size]="32" [strokeWidth]="2" />
            <span class="text-xs text-gray-500">2</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <ngx-ds-icon [icon]="icon" [size]="32" [strokeWidth]="2.5" />
            <span class="text-xs text-gray-500">2.5</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <ngx-ds-icon [icon]="icon" [size]="32" [strokeWidth]="3" />
            <span class="text-xs text-gray-500">3</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
class SizesWrapper {
  readonly icon = Settings2;
}

// ── Colors Wrapper ────────────────────────────────────────────────────────────

@Component({
  selector: 'icon-colors-wrapper',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="p-6 space-y-4">
      <p class="text-sm text-gray-500 mb-4">
        Color via propiedad
        <code class="bg-gray-100 text-gray-700 px-1 rounded text-xs">color</code> o heredado de CSS
      </p>
      <div class="flex flex-wrap items-center gap-6">
        <div class="flex flex-col items-center gap-2">
          <ngx-ds-icon [icon]="icon" [size]="32" color="#3b82f6" />
          <span class="text-xs text-gray-500">Primary</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ngx-ds-icon [icon]="icon" [size]="32" color="#6b7280" />
          <span class="text-xs text-gray-500">Secondary</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ngx-ds-icon [icon]="icon" [size]="32" color="#ef4444" />
          <span class="text-xs text-gray-500">Danger</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ngx-ds-icon [icon]="icon" [size]="32" color="#10b981" />
          <span class="text-xs text-gray-500">Success</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ngx-ds-icon [icon]="icon" [size]="32" color="#f59e0b" />
          <span class="text-xs text-gray-500">Warning</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ngx-ds-icon [icon]="icon" [size]="32" color="#8b5cf6" />
          <span class="text-xs text-gray-500">Purple</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ngx-ds-icon [icon]="icon" [size]="32" color="#ec4899" />
          <span class="text-xs text-gray-500">Pink</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <span class="text-orange-500" style="display:inline-flex">
            <ngx-ds-icon [icon]="icon" [size]="32" />
          </span>
          <span class="text-xs text-gray-500">currentColor</span>
        </div>
      </div>
    </div>
  `,
})
class ColorsWrapper {
  readonly icon = Heart;
}

// ── Catalog Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'icon-catalog-wrapper',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="p-6 space-y-8">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Acciones</p>
        <div class="flex flex-wrap gap-4">
          @for (item of actions; track item.name) {
            <div class="flex flex-col items-center gap-1.5 w-16">
              <ngx-ds-icon [icon]="item.icon" [size]="24" color="#374151" />
              <span class="text-xs text-gray-500 text-center leading-tight">{{ item.name }}</span>
            </div>
          }
        </div>
      </div>

      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Navegación</p>
        <div class="flex flex-wrap gap-4">
          @for (item of navigation; track item.name) {
            <div class="flex flex-col items-center gap-1.5 w-16">
              <ngx-ds-icon [icon]="item.icon" [size]="24" color="#374151" />
              <span class="text-xs text-gray-500 text-center leading-tight">{{ item.name }}</span>
            </div>
          }
        </div>
      </div>

      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Feedback</p>
        <div class="flex flex-wrap gap-4">
          @for (item of feedback; track item.name) {
            <div class="flex flex-col items-center gap-1.5 w-16">
              <ngx-ds-icon [icon]="item.icon" [size]="24" color="#374151" />
              <span class="text-xs text-gray-500 text-center leading-tight">{{ item.name }}</span>
            </div>
          }
        </div>
      </div>

      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
          Comunicación
        </p>
        <div class="flex flex-wrap gap-4">
          @for (item of communication; track item.name) {
            <div class="flex flex-col items-center gap-1.5 w-16">
              <ngx-ds-icon [icon]="item.icon" [size]="24" color="#374151" />
              <span class="text-xs text-gray-500 text-center leading-tight">{{ item.name }}</span>
            </div>
          }
        </div>
      </div>

      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Archivos</p>
        <div class="flex flex-wrap gap-4">
          @for (item of files; track item.name) {
            <div class="flex flex-col items-center gap-1.5 w-16">
              <ngx-ds-icon [icon]="item.icon" [size]="24" color="#374151" />
              <span class="text-xs text-gray-500 text-center leading-tight">{{ item.name }}</span>
            </div>
          }
        </div>
      </div>

      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
          Usuarios & Auth
        </p>
        <div class="flex flex-wrap gap-4">
          @for (item of users; track item.name) {
            <div class="flex flex-col items-center gap-1.5 w-16">
              <ngx-ds-icon [icon]="item.icon" [size]="24" color="#374151" />
              <span class="text-xs text-gray-500 text-center leading-tight">{{ item.name }}</span>
            </div>
          }
        </div>
      </div>

      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Media</p>
        <div class="flex flex-wrap gap-4">
          @for (item of media; track item.name) {
            <div class="flex flex-col items-center gap-1.5 w-16">
              <ngx-ds-icon [icon]="item.icon" [size]="24" color="#374151" />
              <span class="text-xs text-gray-500 text-center leading-tight">{{ item.name }}</span>
            </div>
          }
        </div>
      </div>

      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Sistema</p>
        <div class="flex flex-wrap gap-4">
          @for (item of system; track item.name) {
            <div class="flex flex-col items-center gap-1.5 w-16">
              <ngx-ds-icon [icon]="item.icon" [size]="24" color="#374151" />
              <span class="text-xs text-gray-500 text-center leading-tight">{{ item.name }}</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
class CatalogWrapper {
  readonly actions = [
    { name: 'Plus', icon: Plus },
    { name: 'Minus', icon: Minus },
    { name: 'X', icon: X },
    { name: 'Check', icon: Check },
    { name: 'Pencil', icon: Pencil },
    { name: 'Trash2', icon: Trash2 },
    { name: 'Save', icon: Save },
    { name: 'Copy', icon: Copy },
    { name: 'Search', icon: Search },
    { name: 'Filter', icon: Filter },
    { name: 'Sliders', icon: SlidersHorizontal },
    { name: 'RefreshCw', icon: RefreshCw },
    { name: 'RotateCcw', icon: RotateCcw },
  ];

  readonly navigation = [
    { name: 'ArrowLeft', icon: ArrowLeft },
    { name: 'ArrowRight', icon: ArrowRight },
    { name: 'ArrowUp', icon: ArrowUp },
    { name: 'ArrowDown', icon: ArrowDown },
    { name: 'ChevronLeft', icon: ChevronLeft },
    { name: 'ChevronRight', icon: ChevronRight },
    { name: 'ChevronUp', icon: ChevronUp },
    { name: 'ChevronDown', icon: ChevronDown },
    { name: 'MoveUpRight', icon: MoveUpRight },
    { name: 'CornerUpLeft', icon: CornerUpLeft },
    { name: 'ExternalLink', icon: ExternalLink },
    { name: 'Link', icon: Link },
  ];

  readonly feedback = [
    { name: 'Info', icon: Info },
    { name: 'AlertCircle', icon: AlertCircle },
    { name: 'AlertTriangle', icon: AlertTriangle },
    { name: 'CircleCheck', icon: CircleCheck },
    { name: 'CircleX', icon: CircleX },
    { name: 'HelpCircle', icon: HelpCircle },
  ];

  readonly communication = [
    { name: 'Mail', icon: Mail },
    { name: 'MessageCircle', icon: MessageCircle },
    { name: 'Phone', icon: Phone },
    { name: 'Bell', icon: Bell },
    { name: 'BellOff', icon: BellOff },
    { name: 'Send', icon: Send },
  ];

  readonly files = [
    { name: 'File', icon: File },
    { name: 'FileText', icon: FileText },
    { name: 'Folder', icon: Folder },
    { name: 'FolderOpen', icon: FolderOpen },
    { name: 'Upload', icon: Upload },
    { name: 'Download', icon: Download },
    { name: 'Paperclip', icon: Paperclip },
  ];

  readonly users = [
    { name: 'User', icon: User },
    { name: 'Users', icon: Users },
    { name: 'UserCheck', icon: UserCheck },
    { name: 'UserX', icon: UserX },
    { name: 'LogIn', icon: LogIn },
    { name: 'LogOut', icon: LogOut },
    { name: 'Lock', icon: Lock },
    { name: 'Unlock', icon: Unlock },
    { name: 'ShieldCheck', icon: ShieldCheck },
  ];

  readonly media = [
    { name: 'Play', icon: Play },
    { name: 'Pause', icon: Pause },
    { name: 'Square', icon: Square },
    { name: 'Volume2', icon: Volume2 },
    { name: 'VolumeX', icon: VolumeX },
    { name: 'Image', icon: Image },
    { name: 'Camera', icon: Camera },
    { name: 'Mic', icon: Mic },
    { name: 'MicOff', icon: MicOff },
  ];

  readonly system = [
    { name: 'Settings', icon: Settings },
    { name: 'Settings2', icon: Settings2 },
    { name: 'Sliders', icon: Sliders },
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'LayoutGrid', icon: LayoutGrid },
    { name: 'List', icon: List },
    { name: 'Table2', icon: Table2 },
    { name: 'Clock', icon: Clock },
    { name: 'Globe', icon: Globe },
    { name: 'Heart', icon: Heart },
    { name: 'Star', icon: Star },
    { name: 'Bookmark', icon: Bookmark },
    { name: 'Tag', icon: Tag },
  ];
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Atoms/Icon',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    template: `<icon-default-wrapper />`,
    moduleMetadata: { imports: [DefaultWrapper] },
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `<icon-sizes-wrapper />`,
    moduleMetadata: { imports: [SizesWrapper] },
  }),
};

export const Colors: Story = {
  render: () => ({
    template: `<icon-colors-wrapper />`,
    moduleMetadata: { imports: [ColorsWrapper] },
  }),
};

export const Catalog: Story = {
  render: () => ({
    template: `<icon-catalog-wrapper />`,
    moduleMetadata: { imports: [CatalogWrapper] },
  }),
};
