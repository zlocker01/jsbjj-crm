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
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer } from "@/components/charts/chart-container";
import { TooltipWrapper } from "@/components/charts/tooltip-wrapper";
import type { RevenueData } from "@/interfaces/dashboard";
import { getRevenueDataFromSupabase } from "@/data/supabase-dashboard-queries";

interface RevenueChartProps {
  monthlyData?: RevenueData[];
  weeklyData?: RevenueData[];
}

export function RevenueChart({ monthlyData: initialMonthlyData, weeklyData: initialWeeklyData }: RevenueChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("line");
  const [timeRange, setTimeRange] = useState("monthly");
  const [monthlyData, setMonthlyData] = useState<RevenueData[]>(initialMonthlyData || []);
  const [weeklyData, setWeeklyData] = useState<RevenueData[]>(initialWeeklyData || []);
  const [isLoading, setIsLoading] = useState(!initialMonthlyData || !initialWeeklyData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Si no hay datos iniciales, cargar desde Supabase
        if (!initialMonthlyData) {
          const monthlyRevenueData = await getRevenueDataFromSupabase('monthly');
          setMonthlyData(monthlyRevenueData);
        }
        
        if (!initialWeeklyData) {
          const weeklyRevenueData = await getRevenueDataFromSupabase('weekly');
          setWeeklyData(weeklyRevenueData);
        }
        
        setError(null);
      } catch (err) {
        console.error("Error al cargar datos de ingresos:", err);
        setError("No se pudieron cargar los datos de ingresos");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!initialMonthlyData || !initialWeeklyData) {
      fetchData();
    }
  }, [initialMonthlyData, initialWeeklyData]);

  if (!isMounted) {
    return <ChartContainer isLoading />;
  }
  
  if (isLoading) {
    return <ChartContainer isLoading />;
  }
  
  if (error) {
    return <ChartContainer error={error} />;
  }
  
  const data = timeRange === "monthly" ? monthlyData : weeklyData;
  
  if (data.length === 0) {
    return <ChartContainer empty="No hay datos de ingresos disponibles" />;
  }

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
            <ChartContainer>
              <LineChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <TooltipWrapper
                  formatter={(value) => [`$${value.toLocaleString()}`, ""]}
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
            </ChartContainer>
          )}

          {activeTab === "area" && (
            <ChartContainer>
              <AreaChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <TooltipWrapper
                  formatter={(value) => [`$${value.toLocaleString()}`, ""]}
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
            </ChartContainer>
          )}

          {activeTab === "bar" && (
            <ChartContainer>
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <TooltipWrapper
                  formatter={(value) => [`$${value.toLocaleString()}`, ""]}
                />
                <Legend />
                <Bar dataKey="ingresos" fill="#8884d8" />
                <Bar dataKey="gastos" fill="#82ca9d" />
                <Bar dataKey="beneficio" fill="#ffc658" />
              </BarChart>
            </ChartContainer>
          )}
        </div>
      </Card>
    </div>
  );
}
