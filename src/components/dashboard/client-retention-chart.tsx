"use client";

import { useState, useEffect } from "react";
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer } from "@/components/charts/chart-container";
import { TooltipWrapper } from "@/components/charts/tooltip-wrapper";
import type { ClientRetentionData } from "@/interfaces/dashboard";

interface ClientRetentionChartProps {
  data: ClientRetentionData[];
}

export function ClientRetentionChart({ data }: ClientRetentionChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <ChartContainer isLoading />;
  }

  return (
    <ChartContainer height={400}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis domain={[80, 100]} />
        <TooltipWrapper
          formatter={(value) => [`${value}%`, "Tasa de retención"]}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="tasa"
          name="Tasa de retención"
          stroke="#8884d8"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
