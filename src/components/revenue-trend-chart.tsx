"use client";

import { useState, useEffect } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

// Datos de ejemplo para el gráfico
const data = [
  { month: "Ene", actual: 2400, previo: 2000, objetivo: 2500 },
  { month: "Feb", actual: 1398, previo: 1800, objetivo: 2500 },
  { month: "Mar", actual: 9800, previo: 8000, objetivo: 8500 },
  { month: "Abr", actual: 3908, previo: 3200, objetivo: 3500 },
  { month: "May", actual: 4800, previo: 4100, objetivo: 4500 },
  { month: "Jun", actual: 3800, previo: 3500, objetivo: 4000 },
  { month: "Jul", actual: 4300, previo: 3900, objetivo: 4200 },
  { month: "Ago", actual: 5000, previo: 4200, objetivo: 4800 },
  { month: "Sep", actual: 4000, previo: 3800, objetivo: 4200 },
  { month: "Oct", actual: 3500, previo: 3300, objetivo: 3800 },
  { month: "Nov", actual: 4800, previo: 4000, objetivo: 4500 },
  { month: "Dic", actual: 6000, previo: 5200, objetivo: 5500 },
];

export function RevenueTrendChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <Skeleton className="h-[250px] w-full" />
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  // Calcular el promedio para la línea de referencia
  const avgActual =
    data.reduce((sum, item) => sum + item.actual, 0) / data.length;

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => `$${value}`} />
          <Tooltip
            formatter={(value) => [`$${value.toLocaleString()}`, ""]}
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
            itemStyle={{ padding: "2px 0" }}
            labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
            name="Año actual"
          />
          <Line
            type="monotone"
            dataKey="previo"
            stroke="#82ca9d"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 3 }}
            name="Año anterior"
          />
          <Line
            type="monotone"
            dataKey="objetivo"
            stroke="#ff8042"
            strokeWidth={2}
            strokeDasharray="3 3"
            dot={{ r: 0 }}
            name="Objetivo"
          />
          <ReferenceLine
            y={avgActual}
            stroke="red"
            strokeDasharray="3 3"
            label="Promedio"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
