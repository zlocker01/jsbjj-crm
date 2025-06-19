"use client";

import { useState, useEffect } from "react";
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer } from "@/components/charts/chart-container";
import { TooltipWrapper } from "@/components/charts/tooltip-wrapper";

interface AppointmentCancellationChartProps {
  data: { month: string; tasa: number }[];
}

export function AppointmentCancellationChart({
  data,
}: AppointmentCancellationChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // biome-ignore lint/correctness/noChildrenProp: <explanation>
    return <ChartContainer isLoading children={undefined} />;
  }

  return (
    <ChartContainer height={300}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <TooltipWrapper
          formatter={(value) => [`${value}%`, "Tasa de cancelación"]}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="tasa"
          name="Tasa de cancelación"
          stroke="#F44336"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
