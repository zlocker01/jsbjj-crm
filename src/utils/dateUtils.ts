// Utilidades para fechas

import {
  format as tempoFormat,
  parse as tempoParse,
} from "@formkit/tempo";

// Formatear fecha con formato personalizado
export function formatDate(date: Date | string, formatStr = "PPP"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  // Nota: "PPP" es un formato específico de date-fns.
  // Para Tempo, necesitarás un formato compatible como "long", o uno explícito como "MMMM D, YYYY".
  // Usaremos "long" como un equivalente general. Si necesitas "Día, Mes Día, Año", sería "dddd, MMMM D, YYYY"
  // Por ahora, mantendremos la idea de un formato largo por defecto.
  // Si "PPP" se traduce a "MMM d, yyyy" (ej: Jan 1, 2023), en Tempo sería "MMM D, YYYY"
  // Si "PPP" se traduce a "MMMM d, yyyy" (ej: January 1, 2023), en Tempo sería "MMMM D, YYYY"
  // Asumamos que PPP es "Mes Día, Año" -> "MMMM D, YYYY"
  const tempoFormatStr = formatStr === "PPP" ? "MMMM D, YYYY" : formatStr;
  return tempoFormat(dateObj, tempoFormatStr, "es");
}

// Nueva función para validar si un string es una fecha válida usando tempoParse
export function isValidDateString(dateString: string, format?: string): boolean {
  return tempoParse(dateString, format) !== null;
}

// Formatear fecha y hora
export function formatDateTime(
  date: Date | string,
  formatStr = "PPP HH:mm",
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  // Similar a formatDate, ajustamos "PPP"
  const tempoFormatStr =
    formatStr === "PPP HH:mm" ? "MMMM D, YYYY HH:mm" : formatStr;
  return tempoFormat(dateObj, tempoFormatStr, "es");
}

// Obtener el nombre del mes
export function getMonthName(month: number): string {
  // month is 0-indexed (0 for January)
  const date = new Date();
  date.setMonth(month);
  date.setDate(1); // Asegurar que es el primer día del mes para evitar problemas con meses cortos
  return tempoFormat(date, "MMMM", "es");
}

// Obtener el nombre del día de la semana
export function getDayName(day: number): string {
  // day is 0-indexed (0 for Sunday, 1 for Monday, etc. by Date.getDay())
  // Esta lógica original para obtener el nombre del día basado en un índice (0-6)
  // puede ser simplificada si solo queremos el nombre de un día específico.
  // La lógica original: date.setDate(date.getDate() - date.getDay() + day)
  // crea una fecha que cae en esa `day` de la semana actual.
  const date = new Date();
  const currentDay = date.getDay(); // 0 (Sun) - 6 (Sat)
  date.setDate(date.getDate() - currentDay + day);
  return tempoFormat(date, "dddd", "es"); // "dddd" para el nombre completo del día
}

// Validar si una cadena es una fecha válida según un formato
export function isValidDate(
  dateString: string,
  formatStr = "YYYY-MM-DD",
): boolean {
  // Tempo's parse devuelve `false` si no puede parsear, o una Date si tiene éxito.
  // Tempo's isValidDate verifica si la cadena coincide con el formato.
  return tempoParse(dateString, formatStr) !== null;
}
