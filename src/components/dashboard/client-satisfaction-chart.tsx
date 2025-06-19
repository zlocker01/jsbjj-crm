"use client";

import { useState, useEffect } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";
import { ChartContainer } from "@/components/charts/chart-container";
import { TooltipWrapper } from "@/components/charts/tooltip-wrapper";
import type { ClientSatisfactionData } from "@/interfaces/dashboard";

interface ClientSatisfactionChartProps {
  data: ClientSatisfactionData[];
}

export function ClientSatisfactionChart({
  data,
}: ClientSatisfactionChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <ChartContainer isLoading />;
  }

  return (
    <ChartContainer height={350}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
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
        <TooltipWrapper />
      </RadarChart>
    </ChartContainer>
  );
}
