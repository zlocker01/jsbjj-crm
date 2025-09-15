"use client";

import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ChartContainer } from "@/components/charts/chart-container";
import { TooltipWrapper } from "@/components/charts/tooltip-wrapper";
import { filterDataForMobile } from "@/lib/chart-utils";
import type { MetricData } from "@/interfaces/dashboard";
import { getMetricsDataFromSupabase } from "@/data/supabase-dashboard-queries";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  
  // Preparar datos específicos para cada tipo de métrica
  const citasData = processedData.map(item => ({
    name: item.name,
    citas: item.citas
  }));
  
  const clientesData = processedData.map(item => ({
    name: item.name,
    clientes: item.clientes
  }));
  
  const ingresosData = processedData.map(item => ({
    name: item.name,
    ingresos: item.ingresos
  }));
  
  // Calcular máximos para cada tipo de dato para escalas adecuadas
  const maxCitas = Math.max(...processedData.map(item => item.citas || 0));
  const maxClientes = Math.max(...processedData.map(item => item.clientes || 0));
  const maxIngresos = Math.max(...processedData.map(item => item.ingresos || 0));

  return (
    <Card>
      <CardContent className="p-4">
        <Tabs defaultValue="combined" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="combined">Combinado</TabsTrigger>
            <TabsTrigger value="citas">Citas</TabsTrigger>
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
            <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
          </TabsList>
          
          {/* Vista combinada con leyenda clara */}
          <TabsContent value="combined" className="mt-4">
            <ChartContainer height={350}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={processedData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#ffc658" />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === "ingresos") {
                        return [`$${Number(value).toLocaleString()}`, "Ingresos"];
                      }
                      if (name === "citas" || name === "clientes") {
                        return [`${value}`, name === "citas" ? "Citas" : "Clientes"];
                      }
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar 
                    yAxisId="left"
                    dataKey="citas" 
                    fill="#8884d8" 
                    name="Citas" 
                    barSize={20}
                    radius={4}
                  />
                  <Bar 
                    yAxisId="left"
                    dataKey="clientes" 
                    fill="#82ca9d" 
                    name="Clientes" 
                    barSize={20}
                    radius={4}
                  />
                  <Bar 
                    yAxisId="right"
                    dataKey="ingresos" 
                    fill="#ffc658" 
                    name="Ingresos ($)" 
                    barSize={20}
                    radius={4}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
          
          {/* Vista de citas */}
          <TabsContent value="citas" className="mt-4">
            <ChartContainer height={350}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={citasData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, maxCitas * 1.1]} />
                  <Tooltip formatter={(value) => [`${value}`, "Citas"]} />
                  <Legend />
                  <Bar 
                    dataKey="citas" 
                    fill="#8884d8" 
                    name="Citas" 
                    barSize={40}
                    radius={4}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
          
          {/* Vista de clientes */}
          <TabsContent value="clientes" className="mt-4">
            <ChartContainer height={350}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={clientesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, maxClientes * 1.1]} />
                  <Tooltip formatter={(value) => [`${value}`, "Clientes"]} />
                  <Legend />
                  <Bar 
                    dataKey="clientes" 
                    fill="#82ca9d" 
                    name="Clientes" 
                    barSize={40}
                    radius={4}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
          
          {/* Vista de ingresos */}
          <TabsContent value="ingresos" className="mt-4">
            <ChartContainer height={350}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ingresosData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, maxIngresos * 1.1]} />
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Ingresos"]} />
                  <Legend />
                  <Bar 
                    dataKey="ingresos" 
                    fill="#ffc658" 
                    name="Ingresos ($)" 
                    barSize={40}
                    radius={4}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
