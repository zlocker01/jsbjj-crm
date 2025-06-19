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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { AppointmentsByDayChart } from "@/components/dashboard/appointments-by-day-chart";
import { AppointmentsByHourChart } from "@/components/dashboard/appointments-by-hour-chart";
import { AppointmentsByServiceChart } from "@/components/dashboard/appointments-by-service-chart";
import { AppointmentStatusChart } from "@/components/dashboard/appointment-status-chart";
import { AppointmentHeatmapChart } from "@/components/dashboard/appointment-heatmap-chart";
import { AppointmentCancellationChart } from "@/components/dashboard/appointment-cancellation-chart";
import {
  getAppointmentsByDayData,
  getAppointmentsByHourData,
  getAppointmentsByServiceData,
  getAppointmentStatusData,
  getHeatmapData,
  getPopularServicesData,
  getAppointmentSummaryData,
  getCancellationTrendData,
} from "@/data/dashboard-data";

export function AppointmentsAnalysis() {
  const [timeRange, setTimeRange] = useState("month");

  // Obtener datos para el análisis de citas
  const appointmentsByDayData = getAppointmentsByDayData();
  const appointmentsByHourData = getAppointmentsByHourData();
  const appointmentsByServiceData = getAppointmentsByServiceData();
  const appointmentStatusData = getAppointmentStatusData();
  const heatmapData = getHeatmapData();
  const popularServicesData = getPopularServicesData();
  const appointmentSummary = getAppointmentSummaryData();
  const cancellationTrendData = getCancellationTrendData();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Análisis de Citas</h2>
          <p className="text-muted-foreground">
            Información detallada sobre las citas en tu negocio
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Período de tiempo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Última semana</SelectItem>
            <SelectItem value="month">Último mes</SelectItem>
            <SelectItem value="quarter">Último trimestre</SelectItem>
            <SelectItem value="year">Último año</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          title="Total de Citas"
          value={appointmentSummary.total}
          changePercent={appointmentSummary.growthPercent}
        />
        <SummaryCard
          title="Tasa de Asistencia"
          value={`${appointmentSummary.attendanceRate}%`}
          changePercent={appointmentSummary.attendanceGrowth}
        />
        <SummaryCard
          title="Duración Promedio"
          value={`${appointmentSummary.avgDuration} min`}
          changePercent={appointmentSummary.durationChange}
        />
      </div>

      <Tabs defaultValue="distribution" className="space-y-4">
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="distribution">Distribución</TabsTrigger>
          <TabsTrigger value="heatmap">Mapa de Calor</TabsTrigger>
          <TabsTrigger value="services">Servicios</TabsTrigger>
          <TabsTrigger value="status">Estado</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Citas por Día de la Semana</CardTitle>
                <CardDescription>
                  Distribución de citas a lo largo de la semana
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <AppointmentsByDayChart data={appointmentsByDayData} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Citas por Hora</CardTitle>
                <CardDescription>
                  Distribución de citas a lo largo del día
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <AppointmentsByHourChart data={appointmentsByHourData} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mapa de Calor de Citas</CardTitle>
              <CardDescription>
                Visualización de las horas más ocupadas por día de la semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <AppointmentHeatmapChart data={heatmapData} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Citas por Servicio</CardTitle>
                <CardDescription>
                  Distribución de citas por tipo de servicio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <AppointmentsByServiceChart
                    data={appointmentsByServiceData}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Servicios Más Populares</CardTitle>
                <CardDescription>
                  Ranking de servicios por número de citas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Servicio</TableHead>
                      <TableHead className="text-right">Citas</TableHead>
                      <TableHead className="text-right">Crecimiento</TableHead>
                      <TableHead className="text-right">Duración</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {popularServicesData.map((service) => (
                      <TableRow key={service.service}>
                        <TableCell className="font-medium">
                          {service.service}
                        </TableCell>
                        <TableCell className="text-right">
                          {service.appointments}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              service.growth.startsWith("+")
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {service.growth}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {service.avgDuration}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Estado de las Citas</CardTitle>
                <CardDescription>
                  Distribución de citas por estado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <AppointmentStatusChart data={appointmentStatusData} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tendencia de Cancelaciones</CardTitle>
                <CardDescription>
                  Evolución de la tasa de cancelación a lo largo del tiempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <AppointmentCancellationChart data={cancellationTrendData} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
