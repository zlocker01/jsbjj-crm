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

  // Tooltip personalizado para colorear solo el texto interior en dorado
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
        }}
      >
        <div style={{ color: gold }}>Cantidad : {p?.x} citas</div>
        <div style={{ color: gold }}>Cantidad : {p?.y} citas</div>
        <div style={{ color: gold }}>Cantidad : {p?.value} citas</div>
      </div>
    );
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <ChartContainer isLoading />;
  }

  return (
    <ChartContainer height={400}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="x"
          type="category"
          name="Día"
          allowDuplicatedCategory={false}
        />
        <YAxis
          dataKey="y"
          type="category"
          name="Hora"
          allowDuplicatedCategory={false}
        />
        <ZAxis dataKey="value" range={[100, 1000]} name="Citas" />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<HeatmapTooltip />} />
        <Scatter data={data} fill="#8884d8" shape="circle" />
      </ScatterChart>
    </ChartContainer>
  );
}
