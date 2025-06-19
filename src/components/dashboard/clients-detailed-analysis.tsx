"use client";

import { useState } from "react";
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

export function ClientsDetailedAnalysis() {
  const [timeRange, setTimeRange] = useState("year");

  // Obtener datos para el análisis de clientes
  const clientGrowthData = getClientGrowthData();
  const clientSegmentData = getClientSegmentData();
  const clientRetentionData = getClientRetentionData();
  const clientSatisfactionData = getClientSatisfactionData();
  const clientSourceData = getClientSourceData();
  const clientSummary = getClientSummaryData();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Análisis de Clientes</h2>
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
          title="Clientes Totales"
          value={clientSummary.total}
          changePercent={clientSummary.growthPercent}
        />
        <SummaryCard
          title="Tasa de Retención"
          value={`${clientSummary.retentionRate}%`}
          changePercent={clientSummary.retentionGrowth}
        />
        <SummaryCard
          title="Valor Promedio"
          value={`$${clientSummary.avgValue}`}
          changePercent={clientSummary.avgValueGrowth}
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
                <ClientGrowthChart data={clientGrowthData} />
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
                  <ClientSegmentationChart data={clientSegmentData} />
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
                  <ClientSourceChart data={clientSourceData} />
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
                <ClientRetentionChart data={clientRetentionData} />
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
                  <ClientSatisfactionChart data={clientSatisfactionData} />
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
                <ClientsOverviewChart data={getClientOverviewData()} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
