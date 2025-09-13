"use client";

import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import { ChartContainer } from "@/components/charts/chart-container";
import { TooltipWrapper } from "@/components/charts/tooltip-wrapper";
import type { AppointmentByHourData } from "@/interfaces/dashboard";

interface AppointmentsByHourChartProps {
  data: AppointmentByHourData[];
}

export function AppointmentsByHourChart({
  data,
}: AppointmentsByHourChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <ChartContainer isLoading />;
  }

  return (
    <ChartContainer height={300}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" />
        <YAxis dataKey="hour" type="category" />
        <TooltipWrapper formatter={(value) => [`${value} citas`, ""]} />
        <Legend />
        <Bar 
          dataKey="citas" 
          name="Número de citas" 
          fill="#82ca9d" 
          barSize={30}
          radius={4}
        />
      </BarChart>
    </ChartContainer>
  );
}
