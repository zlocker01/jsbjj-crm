// Utilidades para fechas

import { format, parse, isValid } from "date-fns";
import { es } from "date-fns/locale";

// Formatear fecha con formato personalizado
export function formatDate(date: Date | string, formatStr = "PPP"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, formatStr, { locale: es });
}

// Formatear fecha y hora
export function formatDateTime(
  date: Date | string,
  formatStr = "PPP HH:mm",
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, formatStr, { locale: es });
}

// Obtener el nombre del mes
export function getMonthName(month: number): string {
  const date = new Date();
  date.setMonth(month);
  return format(date, "MMMM", { locale: es });
}

// Obtener el nombre del día de la semana
export function getDayName(day: number): string {
  const date = new Date();
  date.setDate(date.getDate() - date.getDay() + day);
  return format(date, "EEEE", { locale: es });
}

// Validar si una cadena es una fecha válida
export function isValidDate(
  dateString: string,
  formatStr = "yyyy-MM-dd",
): boolean {
  const parsedDate = parse(dateString, formatStr, new Date());
  return isValid(parsedDate);
}
