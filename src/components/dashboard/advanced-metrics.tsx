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

// Datos de ejemplo para el gráfico de radar
const satisfactionData = [
  { subject: "Atención", A: 120, B: 110, fullMark: 150 },
  { subject: "Calidad", A: 98, B: 130, fullMark: 150 },
  { subject: "Precio", A: 86, B: 130, fullMark: 150 },
  { subject: "Ambiente", A: 99, B: 100, fullMark: 150 },
  { subject: "Puntualidad", A: 85, B: 90, fullMark: 150 },
  { subject: "Limpieza", A: 65, B: 85, fullMark: 150 },
];

// Datos para el gráfico de servicios por hora
const servicesByHourData = [
  { hour: "8-9", corte: 4, manicura: 2, facial: 1, masaje: 0 },
  { hour: "9-10", corte: 6, manicura: 3, facial: 2, masaje: 1 },
  { hour: "10-11", corte: 8, manicura: 5, facial: 3, masaje: 2 },
  { hour: "11-12", corte: 10, manicura: 7, facial: 4, masaje: 3 },
  { hour: "12-13", corte: 12, manicura: 8, facial: 5, masaje: 4 },
  { hour: "13-14", corte: 8, manicura: 6, facial: 3, masaje: 2 },
  { hour: "14-15", corte: 6, manicura: 4, facial: 2, masaje: 1 },
  { hour: "15-16", corte: 9, manicura: 5, facial: 3, masaje: 2 },
  { hour: "16-17", corte: 11, manicura: 7, facial: 4, masaje: 3 },
  { hour: "17-18", corte: 13, manicura: 9, facial: 5, masaje: 4 },
  { hour: "18-19", corte: 10, manicura: 6, facial: 3, masaje: 2 },
  { hour: "19-20", corte: 7, manicura: 4, facial: 2, masaje: 1 },
];

export function AdvancedMetrics() {
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
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <div className="h-[350px]">
              {/* Aquí puedes implementar otro tipo de gráfico para servicios por hora */}
              <p className="text-center text-muted-foreground">
                Distribución de servicios por hora del día
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
