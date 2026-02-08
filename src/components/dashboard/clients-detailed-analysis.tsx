"use client";

import { useState, useEffect } from "react";
import type { ClientGrowthData, ClientSegmentData, ClientRetentionData, ClientSatisfactionData } from "@/interfaces/dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { ClientGrowthChart } from "@/components/dashboard/client-growth-chart";
import { ClientSegmentationChart } from "@/components/dashboard/client-segmentation-chart";
import { ClientRetentionChart } from "@/components/dashboard/client-retention-chart";
import { ClientSatisfactionChart } from "@/components/dashboard/client-satisfaction-chart";
import { ClientSourceChart } from "@/components/dashboard/client-source-chart";
import {
  getClientGrowthData,
  getClientSegmentData,
  getClientRetentionData,
  getClientSatisfactionData,
  getClientSourceData,
  getClientSummaryData,
  getClientOverviewData, // Import missing function
} from "@/data/dashboard-data";
import { ClientsOverviewChart } from "@/components/dashboard/clients-overview-chart";
// Importar las funciones para obtener datos desde Supabase
import {
  getClientGrowthDataFromSupabase,
  getClientSegmentDataFromSupabase,
  getClientRetentionDataFromSupabase,
  getClientSatisfactionDataFromSupabase,
  getClientSourcesFromSupabase,
} from "@/data/supabase-dashboard-queries";

export function ClientsDetailedAnalysis() {
  const [timeRange, setTimeRange] = useState("year");
  const [loading, setLoading] = useState(true);
  
  // Estados para almacenar los datos obtenidos de Supabase
  const [clientGrowthData, setClientGrowthData] = useState<ClientGrowthData[]>([]);
  const [clientSegmentData, setClientSegmentData] = useState<ClientSegmentData[]>([]);
  const [clientRetentionData, setClientRetentionData] = useState<ClientRetentionData[]>([]);
  const [clientSatisfactionData, setClientSatisfactionData] = useState<ClientSatisfactionData[]>([]);
  const [clientSourceData, setClientSourceData] = useState<ClientSegmentData[]>([]);
  
  // Obtener datos de respaldo para el resumen y overview
  const clientSummary = getClientSummaryData();
  
  // Efecto para cargar los datos desde Supabase al montar el componente
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Cargar datos desde Supabase en paralelo
        const [growth, segment, retention, satisfaction, sources] = await Promise.all([
          getClientGrowthDataFromSupabase(),
          getClientSegmentDataFromSupabase(),
          getClientRetentionDataFromSupabase(),
          getClientSatisfactionDataFromSupabase(),
          getClientSourcesFromSupabase(),
        ]);
        
        // Actualizar los estados con los datos obtenidos
        setClientGrowthData(growth);
        setClientSegmentData(segment);
        setClientRetentionData(retention);
        setClientSatisfactionData(satisfaction);
        setClientSourceData(sources.length > 0 ? sources : getClientSourceData());
      } catch (error) {
        console.error("Error al cargar datos de clientes:", error);
        // Cargar datos de respaldo en caso de error
        setClientGrowthData(getClientGrowthData());
        setClientSegmentData(getClientSegmentData());
        setClientRetentionData(getClientRetentionData());
        setClientSatisfactionData(getClientSatisfactionData());
        setClientSourceData(getClientSourceData());
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [timeRange]); // Recargar datos cuando cambie el rango de tiempo

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Análisis de Alumnos</h2>
          <p className="text-muted-foreground">
            Información detallada sobre tu base de clientes
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Período de tiempo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Último mes</SelectItem>
            <SelectItem value="quarter">Último trimestre</SelectItem>
            <SelectItem value="year">Último año</SelectItem>
            <SelectItem value="all">Todo el historial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          title="Alumnos Totales"
          value={clientSummary.total}
          changePercent={clientSummary.growthPercent}
          loading={loading}
        />
        <SummaryCard
          title="Tasa de Retención"
          value={`${clientSummary.retentionRate}%`}
          changePercent={clientSummary.retentionGrowth}
          loading={loading}
        />
        <SummaryCard
          title="Valor Promedio"
          value={`$${clientSummary.avgValue}`}
          changePercent={clientSummary.avgValueGrowth}
          loading={loading}
        />
      </div>

      <Tabs defaultValue="growth" className="space-y-4">
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="growth">Crecimiento</TabsTrigger>
          <TabsTrigger value="segmentation">Segmentación</TabsTrigger>
          <TabsTrigger value="retention">Retención</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfacción</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Crecimiento de Clientes</CardTitle>
              <CardDescription>
                Evolución de la base de clientes a lo largo del tiempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ClientGrowthChart data={clientGrowthData} isLoading={loading} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segmentation" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Segmentación de Clientes</CardTitle>
                <CardDescription>
                  Distribución de clientes por categoría
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ClientSegmentationChart data={clientSegmentData} isLoading={loading} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Origen de Clientes</CardTitle>
                <CardDescription>
                  Cómo los clientes descubren tu negocio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ClientSourceChart data={clientSourceData} isLoading={loading} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="retention" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tasa de Retención de Clientes</CardTitle>
              <CardDescription>
                Porcentaje de clientes que regresan cada mes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ClientRetentionChart data={clientRetentionData} isLoading={loading} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="satisfaction" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Satisfacción del Cliente</CardTitle>
                <CardDescription>
                  Evaluación de diferentes aspectos del servicio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ClientSatisfactionChart data={clientSatisfactionData} isLoading={loading} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Clientes</CardTitle>
                <CardDescription>
                  Análisis de la base de clientes actual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClientsOverviewChart data={getClientOverviewData()} isLoading={loading} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
