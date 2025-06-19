"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Skeleton } from "@/components/ui/skeleton";

const data = [
  {
    name: "Ene",
    citas: 40,
    ingresos: 2400,
    clientes: 24,
  },
  {
    name: "Feb",
    citas: 30,
    ingresos: 1398,
    clientes: 22,
  },
  {
    name: "Mar",
    citas: 20,
    ingresos: 9800,
    clientes: 29,
  },
  {
    name: "Abr",
    citas: 27,
    ingresos: 3908,
    clientes: 20,
  },
  {
    name: "May",
    citas: 18,
    ingresos: 4800,
    clientes: 21,
  },
  {
    name: "Jun",
    citas: 23,
    ingresos: 3800,
    clientes: 25,
  },
  {
    name: "Jul",
    citas: 34,
    ingresos: 4300,
    clientes: 30,
  },
  {
    name: "Ago",
    citas: 45,
    ingresos: 5000,
    clientes: 32,
  },
  {
    name: "Sep",
    citas: 35,
    ingresos: 4000,
    clientes: 28,
  },
  {
    name: "Oct",
    citas: 30,
    ingresos: 3500,
    clientes: 26,
  },
  {
    name: "Nov",
    citas: 42,
    ingresos: 4800,
    clientes: 34,
  },
  {
    name: "Dic",
    citas: 50,
    ingresos: 6000,
    clientes: 40,
  },
];

export function MetricsOverview() {
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="space-y-2 w-full">
          <Skeleton className="h-[250px] w-full" />
          <div className="flex justify-center gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    );
  }

  // Filtrar datos para dispositivos móviles para mostrar menos barras
  const filteredData = isMobile
    ? data.filter((_, index) => index % 4 === 0)
    : isTablet
      ? data.filter((_, index) => index % 2 === 0)
      : data;

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={filteredData}
        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
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
          itemStyle={{ padding: "2px 0" }}
          labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
        />
        <Legend />
        <Bar dataKey="citas" fill="#8884d8" name="Citas" />
        <Bar dataKey="clientes" fill="#82ca9d" name="Clientes" />
        <Bar dataKey="ingresos" fill="#ffc658" name="Ingresos ($)" />
      </BarChart>
    </ResponsiveContainer>
  );
}
