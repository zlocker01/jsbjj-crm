"use client";

import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
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

export function RevenueChart({
  monthlyData: initialMonthlyData,
  weeklyData: initialWeeklyData,
}: RevenueChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [timeRange, setTimeRange] = useState("monthly");
  const [monthlyData, setMonthlyData] = useState<RevenueData[]>(
    initialMonthlyData || []
  );
  const [weeklyData, setWeeklyData] = useState<RevenueData[]>(
    initialWeeklyData || []
  );
  const [isLoading, setIsLoading] = useState(
    !initialMonthlyData || !initialWeeklyData
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (!initialMonthlyData) {
          const monthlyRevenueData = await getRevenueDataFromSupabase(
            "monthly"
          );
          setMonthlyData(monthlyRevenueData);
        }
        
        if (!initialWeeklyData) {
          const weeklyRevenueData = await getRevenueDataFromSupabase("weekly");
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
          <ChartContainer>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <TooltipWrapper
                formatter={(value) => {
                  const numValue =
                    typeof value === "string" ? parseFloat(value) : value;
                  return [`$${numValue.toLocaleString()}`, "Ingresos"];
                }}
              />
              <Legend />
              <Bar dataKey="ingresos" fill="#8884d8" name="Ingresos" />
            </BarChart>
          </ChartContainer>
        </div>
      </Card>
    </div>
  );
}
