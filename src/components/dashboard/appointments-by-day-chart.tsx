"use client";

import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import { ChartContainer } from "@/components/charts/chart-container";
import { TooltipWrapper } from "@/components/charts/tooltip-wrapper";
import type { AppointmentByDayData } from "@/interfaces/dashboard";
import { getAppointmentsByDayFromSupabase } from "@/data/supabase-dashboard-queries";

interface AppointmentsByDayChartProps {
  data?: AppointmentByDayData[];
}

export function AppointmentsByDayChart({ data: initialData }: AppointmentsByDayChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState<AppointmentByDayData[]>(initialData || []);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Si no hay datos iniciales, cargar desde Supabase
    if (!initialData) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const appointmentsData = await getAppointmentsByDayFromSupabase();
          setData(appointmentsData);
          setError(null);
        } catch (err) {
          console.error("Error al cargar datos de citas por día:", err);
          setError("No se pudieron cargar los datos de citas por día");
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
    return <ChartContainer empty="No hay datos de citas por día disponibles" />;
  }

  return (
    <ChartContainer height={300}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" allowDecimals={false} />
        <YAxis dataKey="day" type="category" />
        <TooltipWrapper formatter={(value) => {
          const numValue = typeof value === 'string' ? parseFloat(value) : value;
          return [`${numValue} citas`, ""];
        }} />
        <Legend />
        <Bar 
          dataKey="citas" 
          name="Número de citas" 
          fill="#8884d8" 
          barSize={30}
          radius={4}
        />
      </BarChart>
    </ChartContainer>
  );
}
