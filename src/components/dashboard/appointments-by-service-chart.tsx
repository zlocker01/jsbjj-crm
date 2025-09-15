"use client";

import { useState, useEffect } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { ChartContainer } from "@/components/charts/chart-container";
import { TooltipWrapper } from "@/components/charts/tooltip-wrapper";
import type { AppointmentByServiceData } from "@/interfaces/dashboard";
import { getAppointmentsByServiceFromSupabase } from "@/data/supabase-dashboard-queries";

interface AppointmentsByServiceChartProps {
  data?: AppointmentByServiceData[];
}

export function AppointmentsByServiceChart({
  data: initialData,
}: AppointmentsByServiceChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState<AppointmentByServiceData[]>(initialData || []);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Si no hay datos iniciales, cargar desde Supabase
    if (!initialData) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const servicesData = await getAppointmentsByServiceFromSupabase();
          setData(servicesData);
          setError(null);
        } catch (err) {
          console.error("Error al cargar datos de citas por servicio:", err);
          setError("No se pudieron cargar los datos de citas por servicio");
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
    return <ChartContainer empty="No hay datos de citas por servicio disponibles" />;
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
        <TooltipWrapper formatter={(value) => {
          const numValue = typeof value === 'string' ? parseFloat(value) : value;
          return [`${numValue} citas`, ""];
        }} />
      </PieChart>
    </ChartContainer>
  );
}
