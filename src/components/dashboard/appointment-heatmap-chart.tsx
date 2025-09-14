"use client";

import { useState, useEffect } from "react";
import {
  CartesianGrid,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
  type TooltipProps,
} from "recharts";
import { ChartContainer } from "@/components/charts/chart-container";
import type { HeatmapData } from "@/interfaces/dashboard";

interface AppointmentHeatmapChartProps {
  data: HeatmapData[];
}

export function AppointmentHeatmapChart({
  data,
}: AppointmentHeatmapChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  // Ordenar los datos para que los días y horas aparezcan en orden lógico
  const sortedData = [...data].sort((a, b) => {
    const dayOrder = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    const hourOrder = ["8-10", "10-12", "12-14", "14-16", "16-18", "18-20"];
    
    const dayDiff = dayOrder.indexOf(a.x) - dayOrder.indexOf(b.x);
    if (dayDiff !== 0) return dayDiff;
    
    return hourOrder.indexOf(a.y) - hourOrder.indexOf(b.y);
  });

  // Tooltip personalizado para mostrar información clara
  const HeatmapTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (!active || !payload || payload.length === 0) return null;
    const p = payload[0]?.payload as any;
    const gold = "#C6A961";
    return (
      <div
        style={{
          backgroundColor: "var(--background)",
          border: `1px solid ${gold}`,
          borderRadius: "0.375rem",
          padding: "8px 12px",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        <div style={{ color: gold, marginBottom: "4px", fontWeight: "bold" }}>
          Información de Citas
        </div>
        <div style={{ color: "var(--foreground)" }}>
          <span style={{ fontWeight: "600" }}>Día:</span> {p?.x}
        </div>
        <div style={{ color: "var(--foreground)" }}>
          <span style={{ fontWeight: "600" }}>Hora:</span> {p?.y}
        </div>
        <div style={{ color: "var(--foreground)", fontWeight: "bold" }}>
          <span style={{ color: gold }}>Total:</span> {p?.value} citas
        </div>
      </div>
    );
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <ChartContainer isLoading />;
  }
  
  // Calcular el valor máximo para la leyenda
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="flex flex-col h-full w-full">
      <ChartContainer height={400}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="x"
            type="category"
            name="Día"
            allowDuplicatedCategory={false}
            tick={{ fontSize: 14, fontWeight: 500 }}
            tickLine={{ stroke: "var(--primary)" }}
            axisLine={{ stroke: "var(--primary)" }}
          />
          <YAxis
            dataKey="y"
            type="category"
            name="Hora"
            allowDuplicatedCategory={false}
            tick={{ fontSize: 14, fontWeight: 500 }}
            tickLine={{ stroke: "var(--primary)" }}
            axisLine={{ stroke: "var(--primary)" }}
          />
          <ZAxis 
            dataKey="value" 
            range={[200, 1500]} 
            name="Citas" 
          />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<HeatmapTooltip />} />
          <Scatter 
            data={sortedData.map(entry => ({
              ...entry,
              fill: entry.value >= 12 ? "#ff5252" : // Rojo para valores altos
                    entry.value >= 8 ? "#ffa726" : // Naranja para valores medios-altos
                    entry.value >= 5 ? "#ffeb3b" : // Amarillo para valores medios
                    entry.value >= 2 ? "#66bb6a" : // Verde para valores bajos-medios
                    "#90caf9"                     // Azul claro para valores muy bajos
            }))}
            shape="circle"
            fillOpacity={0.8}
            fill="#8884d8" // Este valor será sobrescrito por los datos
          />
        </ScatterChart>
      </ChartContainer>
      <div className="text-sm text-center h-full text-muted-foreground w-full px-4">
        <span className="inline-block w-3 h-3 rounded-full bg-[#90caf9] mr-1"></span> 1-2 citas
        <span className="inline-block w-3 h-3 rounded-full bg-[#66bb6a] mx-2 mr-1"></span> 2-4 citas
        <span className="inline-block w-3 h-3 rounded-full bg-[#ffeb3b] mx-2 mr-1"></span> 5-7 citas
        <span className="inline-block w-3 h-3 rounded-full bg-[#ffa726] mx-2 mr-1"></span> 8-11 citas
        <span className="inline-block w-3 h-3 rounded-full bg-[#ff5252] mx-2"></span> 12+ citas
      </div>
    </div>
  );
}
