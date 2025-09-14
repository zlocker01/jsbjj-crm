"use client";

import { useState, useEffect } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { ChartContainer } from "@/components/charts/chart-container";
import { TooltipWrapper } from "@/components/charts/tooltip-wrapper";
import type { ClientSegmentData } from "@/interfaces/dashboard";

interface ClientSegmentationChartProps {
  data: ClientSegmentData[];
  isLoading: boolean;
}

export function ClientSegmentationChart({
  data,
  isLoading,
}: ClientSegmentationChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <ChartContainer isLoading />;
  }

  return (
    <ChartContainer height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <TooltipWrapper />
      </PieChart>
    </ChartContainer>
  );
}
