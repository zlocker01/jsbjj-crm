"use client";

import { useState, useEffect } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { ChartContainer } from "@/components/charts/chart-container";
import { TooltipWrapper } from "@/components/charts/tooltip-wrapper";
import type { ClientSegmentData } from "@/interfaces/dashboard";
import { getClientSourcesFromSupabase } from "@/data/supabase-dashboard-queries";

interface ClientsOverviewChartProps {
  data?: ClientSegmentData[];
  isLoading: boolean;
  
}

export function ClientsOverviewChart({ data: initialData }: ClientsOverviewChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState<ClientSegmentData[]>(initialData || []);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Si no hay datos iniciales, cargar desde Supabase
    if (!initialData) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const clientsData = await getClientSourcesFromSupabase();
          setData(clientsData);
          setError(null);
        } catch (err) {
          console.error("Error al cargar datos de fuentes de clientes:", err);
          setError("No se pudieron cargar los datos de fuentes de clientes");
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
    return <ChartContainer empty="No hay datos de fuentes de clientes disponibles" />;
  }

  return (
    <ChartContainer height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {data.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={entry.color} />
          ))}
        </Pie>
        <TooltipWrapper formatter={(value) => [`${value} clientes`, ""]} />
      </PieChart>
    </ChartContainer>
  );
}
