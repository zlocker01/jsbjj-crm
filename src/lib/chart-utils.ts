// Utilidades para gráficos

// Estilos consistentes para tooltips
export const tooltipStyles = {
  contentStyle: {
    backgroundColor: 'var(--card)',
    borderColor: 'var(--border)',
    borderWidth: '1px',
    borderRadius: '0.375rem',
    boxShadow:
      '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
    color: 'var(--foreground)',
    padding: '10px 14px',
  },
  itemStyle: {
    padding: '3px 0',
    color: 'var(--foreground)',
    fontWeight: '500',
  },
  labelStyle: {
    fontWeight: 'bold',
    marginBottom: '6px',
    color: 'var(--primary)',
    fontSize: '0.95rem',
  },
};

// Formateadores para diferentes tipos de datos
export const formatters = {
  // Función para formatear valores monetarios
  currency: (value: number) => `$${value.toLocaleString()}`,

  // Función para formatear porcentajes
  percent: (value: number) => `${value}%`,

  // Función para formatear cantidades
  quantity: (value: number, label: string) => [
    `${value.toLocaleString()} ${label}`,
    '',
  ],

  // Función para formatear fechas
  date: (date: Date) =>
    date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
};

// Filtrar datos para dispositivos móviles
export function filterDataForMobile(
  data: any[],
  isMobile: boolean,
  isTablet: boolean
) {
  if (isMobile) {
    return data.filter((_, index) => index % 4 === 0);
  } else if (isTablet) {
    return data.filter((_, index) => index % 2 === 0);
  }
  return data;
}

// Calcular el promedio de un array de números
export function calculateAverage(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

// Calcular el promedio de una propiedad específica en un array de objetos
export function calculatePropertyAverage(
  data: any[],
  property: string
): number {
  if (data.length === 0) {
    return 0;
  }
  return data.reduce((sum, item) => sum + item[property], 0) / data.length;
}
