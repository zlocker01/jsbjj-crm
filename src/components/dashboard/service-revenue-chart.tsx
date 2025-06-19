"use client";

import { useState, useEffect } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { ChartContainer } from "@/components/charts/chart-container";
import { TooltipWrapper } from "@/components/charts/tooltip-wrapper";
import type { ServiceRevenueData } from "@/interfaces/dashboard";

interface ServiceRevenueChartProps {
  data: ServiceRevenueData[];
}

export function ServiceRevenueChart({ data }: ServiceRevenueChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <ChartContainer isLoading />;
  }

  // Si no hay datos, muestra un placeholder
  if (!data || data.length === 0) {
    return (
      <ChartContainer>
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-muted-foreground">Próximamente: Gráfico de Ingresos</p>
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={5}
          dataKey="value"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          labelLine={false}
        >
          {data.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={entry.color} />
          ))}
        </Pie>
        <TooltipWrapper
          formatter={(value) => [`$${value.toLocaleString()}`, "Ingresos"]}
        />
      </PieChart>
    </ChartContainer>
  );
}
