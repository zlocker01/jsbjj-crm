export const dynamic = 'force-dynamic';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users } from "lucide-react";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { MetricsOverviewChart } from "@/components/dashboard/metrics-overview-chart";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { ServiceRevenueChart } from "@/components/dashboard/service-revenue-chart";
import { ClientsOverviewChart } from "@/components/dashboard/clients-overview-chart";
import { ClientsDetailedAnalysis } from "@/components/dashboard/clients-detailed-analysis";
import { AppointmentsAnalysis } from "@/components/dashboard/appointments-analysis";
import { RecentAppointments } from "@/components/dashboard/recent-appointments";

import {
  getMetricsData,
  getRevenueData,
  getServiceRevenueData,
  getClientOverviewData,
  getClientSummaryData,
  getAppointmentSummaryData,
} from "@/data/dashboard-data";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Métricas y estadísticas próximamente.
        </p>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-full">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            En construcción
          </h3>
          <p className="text-sm text-muted-foreground">
            Estamos trabajando para traerte las mejores analíticas para tu negocio.
          </p>
        </div>
      </div>
    </div>
  );
}
