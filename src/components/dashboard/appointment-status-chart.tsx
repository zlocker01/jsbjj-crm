"use client";

import { useState, useEffect } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { ChartContainer } from "@/components/charts/chart-container";
import { TooltipWrapper } from "@/components/charts/tooltip-wrapper";
import type { AppointmentStatusData } from "@/interfaces/dashboard";
import { getAppointmentStatusDataFromSupabase } from "@/data/supabase-dashboard-queries";

interface AppointmentStatusChartProps {
  data?: AppointmentStatusData[];
}

export function AppointmentStatusChart({ data: initialData }: AppointmentStatusChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState<AppointmentStatusData[]>(initialData || []);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Si no hay datos iniciales, cargar desde Supabase
    if (!initialData) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const statusData = await getAppointmentStatusDataFromSupabase();
          setData(statusData);
          setError(null);
        } catch (err) {
          console.error("Error al cargar datos de estado de citas:", err);
          setError("No se pudieron cargar los datos de estado de citas");
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchData();
    }
  }, [initialData]);

  if (!isMounted) {
    return <ChartContainer isLoading />;
  }
  
  if (isLoading) {
    return <ChartContainer isLoading />;
  }
  
  if (error) {
    return <ChartContainer error={error} />;
  }
  
  if (data.length === 0) {
    return <ChartContainer empty="No hay datos de estado de citas disponibles" />;
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
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <TooltipWrapper formatter={(value, name) => [`${value} citas`, name]} />
      </PieChart>
    </ChartContainer>
  );
}
