import { InjectionToken, Provider } from '@angular/core';

/**
 * Every user-visible string rendered by ngx-ds components (visible text and
 * accessible names). Parameterised entries are functions.
 *
 * Inputs such as `placeholder` still win over these defaults when the
 * consumer sets them explicitly.
 */
export interface NgxDsLabels {
  // ── Common ────────────────────────────────────────────────
  close: string;
  clear: string;
  search: string;
  searchPlaceholder: string;
  searching: string;
  selectPlaceholder: string;
  selectAll: string;
  clearSelection: string;
  noResults: string;
  noOptions: string;
  loading: string;
  expand: string;
  collapse: string;
  dialog: string;
  popover: string;
  drawer: string;
  progress: string;
  breadcrumb: string;

  // ── Form controls ─────────────────────────────────────────
  showPassword: string;
  hidePassword: string;
  increment: string;
  decrement: string;
  otpGroup: string;
  otpDigit: (n: number, total: number) => string;
  rangeStart: string;
  rangeEnd: string;
  removeTag: (label: string) => string;
  /** Accessible name of the InlineEdit trigger: "Edit <label>". */
  edit: (label: string) => string;
  save: string;
  removeChip: (label: string) => string;
  rating: string;
  ratingStar: (n: number) => string;
  colorHue: string;
  colorSaturation: string;
  colorLightness: string;
  colorHex: string;
  fileUploadPrompt: string;
  removeFile: string;
  fileTooLarge: (maxMb: number) => string;
  closeAlert: string;
  /** Accessible name of a copy button: "Copy <label>". */
  copy: (label: string) => string;
  copied: string;

  // ── Password strength ─────────────────────────────────────
  passwordRequirements: string;
  passwordStrength: string;
  strengthWeak: string;
  strengthFair: string;
  strengthGood: string;
  strengthStrong: string;
  passwordMinLength: (n: number) => string;
  passwordMaxLength: (n: number) => string;
  passwordLowercase: string;
  passwordUppercase: string;
  passwordNumber: string;
  passwordSpecial: string;

  // ── Dates ─────────────────────────────────────────────────
  datePlaceholder: string;
  calendar: string;
  clearDate: string;
  prevMonth: string;
  nextMonth: string;
  selectDateRange: string;

  // ── Time ──────────────────────────────────────────────────
  timePlaceholder: string;
  selectTime: string;
  clearTime: string;
  hours: string;
  minutes: string;
  timePeriod: string;

  // ── Pagination / table ────────────────────────────────────
  pagination: string;
  prevPage: string;
  nextPage: string;
  rowsPerPage: string;
  pageRange: (start: number, end: number, total: number) => string;
  zeroResults: string;
  tableEmpty: string;
  tableEmptyDescription: string;
  tableAdd: string;
  visibleColumns: string;
  expandRow: string;
  selectRow: string;
  rowActions: string;

  // ── Navigation ────────────────────────────────────────────
  mainNavigation: string;
  expandMenu: string;
  collapseMenu: string;
  openMenu: string;
  closeMenu: string;

  // ── Command palette ───────────────────────────────────────
  commandPalette: string;
  commandPlaceholder: string;
  noResultsFor: (query: string) => string;
  hintNavigate: string;
  hintSelect: string;
  hintClose: string;

  // ── Notifications ─────────────────────────────────────────
  notifications: string;
  notificationCenter: string;
  unreadCount: (n: number) => string;
  markAllRead: string;
  clearAll: string;
  filterAll: string;
  filterUnread: string;
  emptyNotifications: string;
  emptyNotificationsDescription: string;
  emptyUnread: string;
  emptyUnreadDescription: string;
  unread: string;
  dismissNotification: string;
  timeNow: string;
  minutesAgo: (n: number) => string;
  hoursAgo: (n: number) => string;
  daysAgo: (n: number) => string;

  // ── Confirmation ──────────────────────────────────────────
  confirm: string;
  cancel: string;

  // ── Carousel / Lightbox ───────────────────────────────────
  carousel: string;
  slide: string;
  prevSlide: string;
  nextSlide: string;
  goToSlide: (n: number) => string;
  slideOf: (n: number, total: number) => string;
  pauseAutoplay: string;
  playAutoplay: string;
  lightbox: string;

  // ── Splitter ──────────────────────────────────────────────
  resizePanels: string;

  // ── Stat card ─────────────────────────────────────────────
  increase: string;
  decrease: string;
  noChange: string;
}

export const NGX_DS_LABELS_ES: NgxDsLabels = {
  close: 'Cerrar',
  clear: 'Limpiar',
  search: 'Buscar',
  searchPlaceholder: 'Buscar...',
  searching: 'Buscando...',
  selectPlaceholder: 'Seleccionar...',
  selectAll: 'Seleccionar todos',
  clearSelection: 'Limpiar selección',
  noResults: 'Sin resultados',
  noOptions: 'Sin opciones',
  loading: 'Cargando...',
  expand: 'Expandir',
  collapse: 'Colapsar',
  dialog: 'Diálogo',
  popover: 'Popover',
  drawer: 'Panel lateral',
  progress: 'Progreso',
  breadcrumb: 'Ruta de navegación',

  showPassword: 'Mostrar contraseña',
  hidePassword: 'Ocultar contraseña',
  increment: 'Incrementar',
  decrement: 'Decrementar',
  otpGroup: 'Código de verificación',
  otpDigit: (n, total) => `Dígito ${n} de ${total}`,
  rangeStart: 'Valor mínimo',
  rangeEnd: 'Valor máximo',
  removeTag: (label) => `Eliminar ${label}`,
  edit: (label) => (label ? `Editar ${label}` : 'Editar'),
  save: 'Guardar',
  removeChip: (label) => `Quitar ${label}`,
  rating: 'Valoración',
  ratingStar: (n) => `${n} estrella${n > 1 ? 's' : ''}`,
  colorHue: 'Matiz',
  colorSaturation: 'Saturación',
  colorLightness: 'Luminosidad',
  colorHex: 'Color en hexadecimal',
  fileUploadPrompt: 'Arrastra archivos aquí o haz clic para seleccionar',
  removeFile: 'Eliminar archivo',
  fileTooLarge: (mb) => `Supera el máximo de ${mb} MB`,
  closeAlert: 'Cerrar alerta',
  copy: (label) => `Copiar ${label}`,
  copied: 'Copiado',

  passwordRequirements: 'Requisitos de contraseña',
  passwordStrength: 'Fortaleza',
  strengthWeak: 'Débil',
  strengthFair: 'Regular',
  strengthGood: 'Buena',
  strengthStrong: 'Fuerte',
  passwordMinLength: (n) => `Mínimo ${n} caracteres`,
  passwordMaxLength: (n) => `Máximo ${n} caracteres`,
  passwordLowercase: 'Al menos una minúscula (a–z)',
  passwordUppercase: 'Al menos una mayúscula (A–Z)',
  passwordNumber: 'Al menos un número (0–9)',
  passwordSpecial: 'Al menos un carácter especial (!@#…)',

  datePlaceholder: 'DD/MM/AAAA',
  calendar: 'Calendario',
  clearDate: 'Limpiar fecha',
  prevMonth: 'Mes anterior',
  nextMonth: 'Mes siguiente',
  selectDateRange: 'Seleccionar rango de fechas',

  timePlaceholder: 'HH:MM',
  selectTime: 'Seleccionar hora',
  clearTime: 'Limpiar hora',
  hours: 'Horas',
  minutes: 'Minutos',
  timePeriod: 'AM/PM',

  pagination: 'Paginación',
  prevPage: 'Página anterior',
  nextPage: 'Página siguiente',
  rowsPerPage: 'Filas por página:',
  pageRange: (start, end, total) => `${start}–${end} de ${total}`,
  zeroResults: '0 resultados',
  tableEmpty: 'No hay datos disponibles',
  tableEmptyDescription:
    'Aun no hay elementos para mostrar. Intenta ajustando tus filtros o creando un nuevo elemento.',
  tableAdd: 'Agregar',
  visibleColumns: 'Columnas visibles',
  expandRow: 'Expandir fila',
  selectRow: 'Seleccionar fila',
  rowActions: 'Acciones',

  mainNavigation: 'Navegación principal',
  expandMenu: 'Expandir menú',
  collapseMenu: 'Colapsar menú',
  openMenu: 'Abrir menú',
  closeMenu: 'Cerrar menú',

  commandPalette: 'Paleta de comandos',
  commandPlaceholder: 'Buscar comandos...',
  noResultsFor: (q) => `Sin resultados para "${q}"`,
  hintNavigate: 'navegar',
  hintSelect: 'seleccionar',
  hintClose: 'cerrar',

  notifications: 'Notificaciones',
  notificationCenter: 'Centro de notificaciones',
  unreadCount: (n) => `${n} sin leer`,
  markAllRead: 'Marcar todas',
  clearAll: 'Limpiar',
  filterAll: 'Todas',
  filterUnread: 'Sin leer',
  emptyNotifications: 'Sin notificaciones',
  emptyNotificationsDescription: 'Aquí aparecerán tus notificaciones.',
  emptyUnread: 'Sin notificaciones sin leer',
  emptyUnreadDescription: 'Estás al día.',
  unread: 'No leída',
  dismissNotification: 'Descartar notificación',
  timeNow: 'Ahora',
  minutesAgo: (n) => `Hace ${n} min`,
  hoursAgo: (n) => `Hace ${n} h`,
  daysAgo: (n) => `Hace ${n} d`,

  confirm: 'Confirmar',
  cancel: 'Cancelar',

  carousel: 'Carrusel',
  slide: 'Diapositiva',
  prevSlide: 'Diapositiva anterior',
  nextSlide: 'Diapositiva siguiente',
  goToSlide: (n) => `Ir a la diapositiva ${n}`,
  slideOf: (n, total) => `${n} de ${total}`,
  pauseAutoplay: 'Pausar la reproducción automática',
  playAutoplay: 'Reanudar la reproducción automática',
  lightbox: 'Visor de imágenes',
  resizePanels: 'Redimensionar paneles',

  increase: 'Aumento',
  decrease: 'Descenso',
  noChange: 'Sin cambios',
};

export const NGX_DS_LABELS_EN: NgxDsLabels = {
  close: 'Close',
  clear: 'Clear',
  search: 'Search',
  searchPlaceholder: 'Search...',
  searching: 'Searching...',
  selectPlaceholder: 'Select...',
  selectAll: 'Select all',
  clearSelection: 'Clear selection',
  noResults: 'No results',
  noOptions: 'No options',
  loading: 'Loading...',
  expand: 'Expand',
  collapse: 'Collapse',
  dialog: 'Dialog',
  popover: 'Popover',
  drawer: 'Side panel',
  progress: 'Progress',
  breadcrumb: 'Breadcrumb',

  showPassword: 'Show password',
  hidePassword: 'Hide password',
  increment: 'Increment',
  decrement: 'Decrement',
  otpGroup: 'Verification code',
  otpDigit: (n, total) => `Digit ${n} of ${total}`,
  rangeStart: 'Minimum value',
  rangeEnd: 'Maximum value',
  removeTag: (label) => `Remove ${label}`,
  edit: (label) => (label ? `Edit ${label}` : 'Edit'),
  save: 'Save',
  removeChip: (label) => `Remove ${label}`,
  rating: 'Rating',
  ratingStar: (n) => `${n} star${n > 1 ? 's' : ''}`,
  colorHue: 'Hue',
  colorSaturation: 'Saturation',
  colorLightness: 'Lightness',
  colorHex: 'Hex color',
  fileUploadPrompt: 'Drag files here or click to select',
  removeFile: 'Remove file',
  fileTooLarge: (mb) => `Exceeds the ${mb} MB limit`,
  closeAlert: 'Close alert',
  copy: (label) => `Copy ${label}`,
  copied: 'Copied',

  passwordRequirements: 'Password requirements',
  passwordStrength: 'Strength',
  strengthWeak: 'Weak',
  strengthFair: 'Fair',
  strengthGood: 'Good',
  strengthStrong: 'Strong',
  passwordMinLength: (n) => `At least ${n} characters`,
  passwordMaxLength: (n) => `At most ${n} characters`,
  passwordLowercase: 'At least one lowercase letter (a–z)',
  passwordUppercase: 'At least one uppercase letter (A–Z)',
  passwordNumber: 'At least one number (0–9)',
  passwordSpecial: 'At least one special character (!@#…)',

  datePlaceholder: 'DD/MM/YYYY',
  calendar: 'Calendar',
  clearDate: 'Clear date',
  prevMonth: 'Previous month',
  nextMonth: 'Next month',
  selectDateRange: 'Select date range',

  timePlaceholder: 'HH:MM',
  selectTime: 'Select time',
  clearTime: 'Clear time',
  hours: 'Hours',
  minutes: 'Minutes',
  timePeriod: 'AM/PM',

  pagination: 'Pagination',
  prevPage: 'Previous page',
  nextPage: 'Next page',
  rowsPerPage: 'Rows per page:',
  pageRange: (start, end, total) => `${start}–${end} of ${total}`,
  zeroResults: '0 results',
  tableEmpty: 'No data available',
  tableEmptyDescription:
    'There are no items to show yet. Try adjusting your filters or creating a new item.',
  tableAdd: 'Add',
  visibleColumns: 'Visible columns',
  expandRow: 'Expand row',
  selectRow: 'Select row',
  rowActions: 'Actions',

  mainNavigation: 'Main navigation',
  expandMenu: 'Expand menu',
  collapseMenu: 'Collapse menu',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',

  commandPalette: 'Command palette',
  commandPlaceholder: 'Search commands...',
  noResultsFor: (q) => `No results for "${q}"`,
  hintNavigate: 'navigate',
  hintSelect: 'select',
  hintClose: 'close',

  notifications: 'Notifications',
  notificationCenter: 'Notification center',
  unreadCount: (n) => `${n} unread`,
  markAllRead: 'Mark all read',
  clearAll: 'Clear',
  filterAll: 'All',
  filterUnread: 'Unread',
  emptyNotifications: 'No notifications',
  emptyNotificationsDescription: 'Your notifications will show up here.',
  emptyUnread: 'No unread notifications',
  emptyUnreadDescription: "You're all caught up.",
  unread: 'Unread',
  dismissNotification: 'Dismiss notification',
  timeNow: 'Now',
  minutesAgo: (n) => `${n} min ago`,
  hoursAgo: (n) => `${n} h ago`,
  daysAgo: (n) => `${n} d ago`,

  confirm: 'Confirm',
  cancel: 'Cancel',

  carousel: 'Carousel',
  slide: 'Slide',
  prevSlide: 'Previous slide',
  nextSlide: 'Next slide',
  goToSlide: (n) => `Go to slide ${n}`,
  slideOf: (n, total) => `${n} of ${total}`,
  pauseAutoplay: 'Pause autoplay',
  playAutoplay: 'Resume autoplay',
  lightbox: 'Image viewer',
  resizePanels: 'Resize panels',

  increase: 'Increase',
  decrease: 'Decrease',
  noChange: 'No change',
};

export const NGX_DS_LABELS = new InjectionToken<NgxDsLabels>('NGX_DS_LABELS', {
  providedIn: 'root',
  factory: () => NGX_DS_LABELS_ES,
});

/**
 * Overrides the component labels. Keys you omit fall back to `base`
 * (Spanish by default), so a partial object is enough:
 *
 * ```ts
 * provideNgxDsLabels(NGX_DS_LABELS_EN)
 * provideNgxDsLabels({ close: 'Fermer' }, NGX_DS_LABELS_EN)
 * ```
 */
export function provideNgxDsLabels(
  labels: Partial<NgxDsLabels>,
  base: NgxDsLabels = NGX_DS_LABELS_ES,
): Provider {
  return { provide: NGX_DS_LABELS, useValue: { ...base, ...labels } };
}
