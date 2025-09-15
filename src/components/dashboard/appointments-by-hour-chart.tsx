'use client';

import { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts';
import { ChartContainer } from '@/components/charts/chart-container';
import { TooltipWrapper } from '@/components/charts/tooltip-wrapper';
import type { AppointmentByHourData } from '@/interfaces/dashboard';

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

  const normalizedData = data.map((item) => ({
    ...item,
    citas: Array.isArray(item.citas)
      ? item.citas.map(Number).reduce((acc, val) => acc + val, 0)
      : Number(item.citas),
  }));
  return (
    <ChartContainer height={300}>
      <BarChart
        data={normalizedData}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" allowDecimals={false} />
        <YAxis
          dataKey="hour"
          type="category"
          tickFormatter={(hour) => {
            // Si el formato es "9-10", lo dejamos igual (como al inicio)
            return hour;
          }}
        />
        <TooltipWrapper
          formatter={(value) => {
            const numValue = Array.isArray(value)
              ? value.map(Number).reduce((acc, val) => acc + val, 0)
              : typeof value === 'string'
              ? parseFloat(value)
              : value;
            return [Math.round(numValue), 'Citas'];
          }}
        />
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
