"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientsOverview } from "@/components/dashboard/clients-overview";

// Datos de ejemplo para los gráficos
const clientGrowthData = [
  { month: "Ene", nuevos: 15, perdidos: 5, total: 120 },
  { month: "Feb", nuevos: 12, perdidos: 3, total: 129 },
  { month: "Mar", nuevos: 18, perdidos: 4, total: 143 },
  { month: "Abr", nuevos: 14, perdidos: 6, total: 151 },
  { month: "May", nuevos: 10, perdidos: 4, total: 157 },
  { month: "Jun", nuevos: 16, perdidos: 5, total: 168 },
  { month: "Jul", nuevos: 20, perdidos: 7, total: 181 },
  { month: "Ago", nuevos: 22, perdidos: 6, total: 197 },
  { month: "Sep", nuevos: 18, perdidos: 8, total: 207 },
  { month: "Oct", nuevos: 15, perdidos: 5, total: 217 },
  { month: "Nov", nuevos: 17, perdidos: 4, total: 230 },
  { month: "Dic", nuevos: 21, perdidos: 6, total: 245 },
];

const clientSegmentationData = [
  { name: "Nuevos (0-3 meses)", value: 65, color: "#8884d8" },
  { name: "Ocasionales (1-3 visitas/año)", value: 85, color: "#82ca9d" },
  { name: "Regulares (4-8 visitas/año)", value: 45, color: "#ffc658" },
  { name: "Frecuentes (9+ visitas/año)", value: 30, color: "#ff8042" },
  { name: "VIP (Top 10% en gasto)", value: 20, color: "#0088fe" },
];

const clientRetentionData = [
  { month: "Ene", tasa: 92 },
  { month: "Feb", tasa: 94 },
  { month: "Mar", tasa: 91 },
  { month: "Abr", tasa: 88 },
  { month: "May", tasa: 90 },
  { month: "Jun", tasa: 93 },
  { month: "Jul", tasa: 95 },
  { month: "Ago", tasa: 94 },
  { month: "Sep", tasa: 92 },
  { month: "Oct", tasa: 91 },
  { month: "Nov", tasa: 93 },
  { month: "Dic", tasa: 96 },
];

const clientSatisfactionData = [
  { aspect: "Atención", valor: 4.8, fullMark: 5 },
  { aspect: "Calidad", valor: 4.6, fullMark: 5 },
  { aspect: "Precio", valor: 4.2, fullMark: 5 },
  { aspect: "Instalaciones", valor: 4.5, fullMark: 5 },
  { aspect: "Puntualidad", valor: 4.3, fullMark: 5 },
  { aspect: "Resultados", valor: 4.7, fullMark: 5 },
];

const clientSourceData = [
  { name: "Recomendación", value: 45, color: "#8884d8" },
  { name: "Redes sociales", value: 25, color: "#82ca9d" },
  { name: "Búsqueda web", value: 15, color: "#ffc658" },
  { name: "Publicidad local", value: 10, color: "#ff8042" },
  { name: "Otros", value: 5, color: "#0088fe" },
];

export function ClientsDetailedAnalysis() {
  const [isMounted, setIsMounted] = useState(false);
  const [timeRange, setTimeRange] = useState("year");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Análisis de Pacientes</h2>
          <p className="text-muted-foreground">
            Información detallada sobre tu base de pacientes
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Clientes Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">245</div>
            <div className="flex items-center mt-1">
              <Badge
                variant="outline"
                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
              >
                +15.6%
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">
                vs. año anterior
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tasa de Retención</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">92.4%</div>
            <div className="flex items-center mt-1">
              <Badge
                variant="outline"
                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
              >
                +2.1%
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">
                vs. año anterior
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Valor Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$145</div>
            <div className="flex items-center mt-1">
              <Badge
                variant="outline"
                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
              >
                +8.3%
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">
                vs. año anterior
              </span>
            </div>
          </CardContent>
        </Card>
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
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={clientGrowthData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        borderColor: "var(--border)",
                        color: "var(--foreground)",
                      }}
                    />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="nuevos"
                      name="Nuevos clientes"
                      fill="#8884d8"
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="perdidos"
                      name="Clientes perdidos"
                      fill="#ff8042"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="total"
                      name="Total de clientes"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
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
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={clientSegmentationData}
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
                        {clientSegmentationData.map((entry) => (
                          <Cell key={`cell-${entry.name}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--background)",
                          borderColor: "var(--border)",
                          color: "var(--foreground)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
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
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={clientSourceData}
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
                        {clientSourceData.map((entry) => (
                          <Cell key={`cell-${entry.name}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--background)",
                          borderColor: "var(--border)",
                          color: "var(--foreground)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
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
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={clientRetentionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[80, 100]} />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Tasa de retención"]}
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        borderColor: "var(--border)",
                        color: "var(--foreground)",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="tasa"
                      name="Tasa de retención"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
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
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      data={clientSatisfactionData}
                    >
                      <PolarGrid />
                      <PolarAngleAxis dataKey="aspect" />
                      <PolarRadiusAxis angle={30} domain={[0, 5]} />
                      <Radar
                        name="Valoración"
                        dataKey="valor"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--background)",
                          borderColor: "var(--border)",
                          color: "var(--foreground)",
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
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
                <ClientsOverview />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
