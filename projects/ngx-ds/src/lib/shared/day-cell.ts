/** Celda base de un grid de calendario (42 celdas, 6 semanas). */
export interface DayCellBase {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
  isDisabled: boolean;
}

/** Celda de un calendario de selección única. */
export interface DayCell extends DayCellBase {
  isSelected: boolean;
}
