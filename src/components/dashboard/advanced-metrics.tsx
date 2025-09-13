"use client";

import { useState, useEffect } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

// Tipos locales para los datos esperados
type SatisfactionDatum = { subject: string; A: number; B: number; fullMark: number };
type ServicesByHourDatum = { hour: string } & Record<string, number>;

interface AdvancedMetricsProps {
  satisfactionData?: SatisfactionDatum[];
  servicesByHourData?: ServicesByHourDatum[];
}

export function AdvancedMetrics({
  satisfactionData,
  servicesByHourData,
}: AdvancedMetricsProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("satisfaction");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-[350px] flex items-center justify-center">
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas Avanzadas</CardTitle>
        <CardDescription>
          Análisis detallado del rendimiento del negocio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="satisfaction">Satisfacción</TabsTrigger>
            <TabsTrigger value="services">Servicios por Hora</TabsTrigger>
          </TabsList>

          <TabsContent value="satisfaction" className="space-y-4">
            {satisfactionData && satisfactionData.length > 0 ? (
              <>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      data={satisfactionData}
                    >
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 150]} />
                      <Radar
                        name="Este mes"
                        dataKey="A"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                      <Radar
                        name="Mes anterior"
                        dataKey="B"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.6}
                      />
                      <Tooltip
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
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Comparativa de satisfacción del cliente entre este mes y el mes
                  anterior
                </p>
              </>
            ) : (
              <div className="h-[350px] flex items-center justify-center border rounded-md">
                <p className="text-sm text-muted-foreground">
                  Sin datos de satisfacción disponibles
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            {servicesByHourData && servicesByHourData.length > 0 ? (
              <div className="h-[350px]">
                {/* Aquí puedes implementar el gráfico real de servicios por hora */}
                <p className="text-center text-muted-foreground">
                  Distribución de servicios por hora del día
                </p>
              </div>
            ) : (
              <div className="h-[350px] flex items-center justify-center border rounded-md">
                <p className="text-sm text-muted-foreground">
                  Sin datos de servicios por hora disponibles
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
