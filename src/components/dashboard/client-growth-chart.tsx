"use client";

import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer } from "@/components/charts/chart-container";
import { TooltipWrapper } from "@/components/charts/tooltip-wrapper";
import type { ClientGrowthData } from "@/interfaces/dashboard";

interface ClientGrowthChartProps {
  data: ClientGrowthData[];
}

export function ClientGrowthChart({ data }: ClientGrowthChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <ChartContainer isLoading />;
  }

  return (
    <ChartContainer height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis yAxisId="left" orientation="left" />
        <YAxis yAxisId="right" orientation="right" />
        <TooltipWrapper />
        <Legend />
        <Bar
          yAxisId="left"
          dataKey="nuevos"
          name="Nuevos clientes"
          fill="#8884d8"
        />
        <Bar
          yAxisId="left"
          dataKey="perdidos"
          name="Clientes perdidos"
          fill="#ff8042"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="total"
          name="Total de clientes"
          stroke="#82ca9d"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </BarChart>
    </ChartContainer>
  );
}
