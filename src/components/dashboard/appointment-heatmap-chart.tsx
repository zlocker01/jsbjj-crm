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
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          contentStyle={{
            backgroundColor: "var(--background)",
            borderColor: "var(--border)",
            borderWidth: "1px",
            borderRadius: "0.375rem",
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            color: "var(--foreground)",
            padding: "8px 12px",
          }}
          formatter={(value) => [`${value} citas`, "Cantidad"]}
          itemStyle={{ padding: "2px 0" }}
          labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
        />
        <Scatter data={data} fill="#8884d8" shape="circle" />
      </ScatterChart>
    </ChartContainer>
  );
}
