"use client";

import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ChartContainer } from "@/components/charts/chart-container";
import { TooltipWrapper } from "@/components/charts/tooltip-wrapper";
import { filterDataForMobile } from "@/lib/chart-utils";
import type { MetricData } from "@/interfaces/dashboard";

interface MetricsOverviewChartProps {
  data: MetricData[];
}

export function MetricsOverviewChart({ data }: MetricsOverviewChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <ChartContainer isLoading />;
  }

  // Filtrar datos para dispositivos móviles para mostrar menos barras
  const filteredData = filterDataForMobile(data, isMobile, isTablet);

  return (
    <ChartContainer>
      <BarChart
        data={filteredData}
        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <TooltipWrapper
          formatter={(value, name) => {
            if (name === "ingresos") {
              return [`$${value.toLocaleString()}`, "Ingresos"];
            }
            if (name === "citas") {
              return [`${value}`, "Citas"];
            }
            if (name === "clientes") {
              return [`${value}`, "Clientes"];
            }
            return [value, name];
          }}
        />
        <Legend />
        <Bar dataKey="citas" fill="#8884d8" name="Citas" />
        <Bar dataKey="clientes" fill="#82ca9d" name="Clientes" />
        <Bar dataKey="ingresos" fill="#ffc658" name="Ingresos ($)" />
      </BarChart>
    </ChartContainer>
  );
}
