"use client";

import { useState, useEffect } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Datos de ejemplo para los gráficos
const monthlyData = [
  { name: "Ene", ingresos: 2400, gastos: 1800, beneficio: 600 },
  { name: "Feb", ingresos: 1398, gastos: 1200, beneficio: 198 },
  { name: "Mar", ingresos: 9800, gastos: 6500, beneficio: 3300 },
  { name: "Abr", ingresos: 3908, gastos: 2800, beneficio: 1108 },
  { name: "May", ingresos: 4800, gastos: 3200, beneficio: 1600 },
  { name: "Jun", ingresos: 3800, gastos: 2900, beneficio: 900 },
  { name: "Jul", ingresos: 4300, gastos: 3100, beneficio: 1200 },
  { name: "Ago", ingresos: 5000, gastos: 3500, beneficio: 1500 },
  { name: "Sep", ingresos: 4000, gastos: 3000, beneficio: 1000 },
  { name: "Oct", ingresos: 3500, gastos: 2700, beneficio: 800 },
  { name: "Nov", ingresos: 4800, gastos: 3300, beneficio: 1500 },
  { name: "Dic", ingresos: 6000, gastos: 4000, beneficio: 2000 },
];

const weeklyData = [
  { name: "Lun", ingresos: 500, gastos: 350, beneficio: 150 },
  { name: "Mar", ingresos: 700, gastos: 450, beneficio: 250 },
  { name: "Mié", ingresos: 600, gastos: 400, beneficio: 200 },
  { name: "Jue", ingresos: 800, gastos: 500, beneficio: 300 },
  { name: "Vie", ingresos: 1200, gastos: 700, beneficio: 500 },
  { name: "Sáb", ingresos: 1500, gastos: 800, beneficio: 700 },
  { name: "Dom", ingresos: 400, gastos: 300, beneficio: 100 },
];

export function RevenueAnalytics() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("line");
  const [timeRange, setTimeRange] = useState("monthly");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-[350px] flex items-center justify-center">
        <div className="space-y-2 w-full">
          <Skeleton className="h-[300px] w-full" />
          <div className="flex justify-center gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    );
  }

  const data = timeRange === "monthly" ? monthlyData : weeklyData;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-3 w-full sm:w-[300px]">
            <TabsTrigger value="line">Línea</TabsTrigger>
            <TabsTrigger value="area">Área</TabsTrigger>
            <TabsTrigger value="bar">Barras</TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs
          value={timeRange}
          onValueChange={setTimeRange}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-2 w-full sm:w-[200px]">
            <TabsTrigger value="monthly">Mensual</TabsTrigger>
            <TabsTrigger value="weekly">Semanal</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card className="p-2">
        <div className="h-[350px]">
          {activeTab === "line" && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
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
                  formatter={(value) => [`$${value.toLocaleString()}`, ""]}
                  labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ingresos"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="gastos" stroke="#82ca9d" />
                <Line type="monotone" dataKey="beneficio" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          )}

          {activeTab === "area" && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
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
                  formatter={(value) => [`$${value.toLocaleString()}`, ""]}
                  labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="ingresos"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
                <Area
                  type="monotone"
                  dataKey="gastos"
                  stackId="2"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                />
                <Area
                  type="monotone"
                  dataKey="beneficio"
                  stackId="3"
                  stroke="#ffc658"
                  fill="#ffc658"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeTab === "bar" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
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
                  formatter={(value) => [`$${value.toLocaleString()}`, ""]}
                  labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
                />
                <Legend />
                <Bar dataKey="ingresos" fill="#8884d8" />
                <Bar dataKey="gastos" fill="#82ca9d" />
                <Bar dataKey="beneficio" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>
    </div>
  );
}
