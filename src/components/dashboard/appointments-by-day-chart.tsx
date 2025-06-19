"use client";

import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import { ChartContainer } from "@/components/charts/chart-container";
import { TooltipWrapper } from "@/components/charts/tooltip-wrapper";
import type { AppointmentByDayData } from "@/interfaces/dashboard";

interface AppointmentsByDayChartProps {
  data: AppointmentByDayData[];
}

export function AppointmentsByDayChart({ data }: AppointmentsByDayChartProps) {
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
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <TooltipWrapper formatter={(value) => [`${value} citas`, ""]} />
        <Legend />
        <Bar dataKey="citas" name="Número de citas" fill="#8884d8" />
      </BarChart>
    </ChartContainer>
  );
}
