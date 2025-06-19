// Manejadores para acciones del dashboard

// import { getRevenueData } from "@/data/dashboard-data";

// Función para cambiar el rango de tiempo
export function handleTimeRangeChange(
  timeRange: string,
  setTimeRange: (value: string) => void,
) {
  setTimeRange(timeRange);
}

// Función para cambiar el tipo de gráfico
export function handleChartTypeChange(
  chartType: string,
  setChartType: (value: string) => void,
) {
  setChartType(chartType);
}

// Función para obtener datos de ingresos según el rango de tiempo
export function getRevenueDataByTimeRange(timeRange: string) {
  if (timeRange === "weekly") {
    return getRevenueData("weekly");
  }
  return getRevenueData("monthly");
}
