// Este componente define estilos consistentes para tooltips que pueden ser reutilizados
// en toda la aplicación

export const tooltipStyles = {
  contentStyle: {
    backgroundColor: "var(--background)",
    borderColor: "var(--border)",
    borderWidth: "1px",
    borderRadius: "0.375rem",
    boxShadow:
      "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    color: "var(--foreground)",
    padding: "8px 12px",
  },
  itemStyle: {
    padding: "2px 0",
    color: "var(--foreground)",
  },
  labelStyle: {
    fontWeight: "bold",
    marginBottom: "4px",
    color: "var(--foreground)",
  },
  // Función para formatear valores monetarios
  formatCurrency: (value: number) => `$${value.toLocaleString()}`,
  // Función para formatear porcentajes
  formatPercent: (value: number) => `${value}%`,
  // Función para formatear cantidades
  formatQuantity: (value: number, label: string) => [
    `${value.toLocaleString()} ${label}`,
    "",
  ],
};
