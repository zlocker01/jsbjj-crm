"use client";

import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ChartContainer } from "@/components/charts/chart-container";
import { TooltipWrapper } from "@/components/charts/tooltip-wrapper";
import { filterDataForMobile } from "@/lib/chart-utils";
import type { MetricData } from "@/interfaces/dashboard";
import { getMetricsDataFromSupabase } from "@/data/supabase-dashboard-queries";

interface MetricsOverviewChartProps {
  data?: MetricData[];
}

export function MetricsOverviewChart({ data: initialData }: MetricsOverviewChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState<MetricData[]>(initialData || []);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  useEffect(() => {
    setIsMounted(true);
    
    // Si no hay datos iniciales, cargar desde Supabase
    if (!initialData) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const metricsData = await getMetricsDataFromSupabase();
          setData(metricsData);
          setError(null);
        } catch (err) {
          console.error("Error al cargar datos de métricas:", err);
          setError("No se pudieron cargar los datos de métricas");
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
    return <ChartContainer empty="No hay datos de métricas disponibles" />;
  }

  // Filtrar datos para dispositivos móviles para mostrar menos barras
  const filteredData = filterDataForMobile(data, isMobile, isTablet);

  // Asegurarse de que los datos tengan valores para citas y clientes
  const processedData = filteredData.map(item => ({
    ...item,
    citas: typeof item.citas === 'number' ? item.citas : 0,
    clientes: typeof item.clientes === 'number' ? item.clientes : 0,
    ingresos: typeof item.ingresos === 'number' ? item.ingresos : 0
  }));

  // Crear escalas separadas para diferentes magnitudes de datos
  const maxIngresos = Math.max(...processedData.map(item => item.ingresos || 0));
  const maxCitasClientes = Math.max(
    ...processedData.map(item => Math.max(item.citas || 0, item.clientes || 0))
  );

  // Calcular factor de escala para ingresos
  const scaleFactor = maxIngresos > 0 ? maxCitasClientes / maxIngresos : 1;

  // Crear datos normalizados para visualización
  const normalizedData = processedData.map(item => ({
    ...item,
    // Mantener valores originales para el tooltip
    _ingresos: item.ingresos,
    // Normalizar ingresos para la visualización
    ingresos: item.ingresos * scaleFactor
  }));

  return (
    <ChartContainer height={350}>
      <BarChart
        data={normalizedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <TooltipWrapper
          formatter={(value, name, entry) => {
            if (name === "ingresos") {
              // Usar el valor original para el tooltip
              const dataIndex = entry.dataKey && entry.payload ? 
                normalizedData.findIndex(item => item.name === entry.payload.name) : -1;
              
              const originalValue = dataIndex >= 0 ? normalizedData[dataIndex]._ingresos : 0;
              return [`$${originalValue.toLocaleString()}`, "Ingresos"];
            }
            if (name === "citas") {
              return [`${value}`, "Citas"];
            }
            if (name === "clientes") {
              return [`${value}`, "Clientes"];
            }
            return [value, name];
          }}
        />
        <Legend />
        <Bar 
          dataKey="citas" 
          fill="#8884d8" 
          name="Citas" 
          barSize={30}
          radius={4}
        />
        <Bar 
          dataKey="clientes" 
          fill="#82ca9d" 
          name="Clientes" 
          barSize={30}
          radius={4}
        />
        <Bar 
          dataKey="ingresos" 
          fill="#ffc658" 
          name="Ingresos ($)" 
          barSize={30}
          radius={4}
        />
      </BarChart>
    </ChartContainer>
  );
}
