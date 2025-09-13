'use client';

import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { ServiceRevenueData } from '@/interfaces/dashboard';
import { useMediaQuery } from '@/hooks/use-media-query';

interface ServiceRevenueChartProps {
  data: ServiceRevenueData[];
}

const chartConfig = {
  value: {
    label: 'Ingresos por Servicio',
    color: 'var(--chart-2)',
  },
  label: {
    color: 'var(--background)',
  },
} satisfies ChartConfig;

export function ServiceRevenueChart({ data }: ServiceRevenueChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex h-[300px] w-full items-center justify-center">
            <p className="text-muted-foreground">Cargando...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex h-[300px] w-full items-center justify-center">
            <p className="text-muted-foreground">
              Próximamente: Gráfico de Ingresos
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{
          right: 16,
        }}
      >
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 15)}
          hide
        />
        <XAxis dataKey="value" type="number" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Bar
          dataKey="value"
          layout="vertical"
          fill="var(--color-value)"
          radius={4}
          barSize={30}
        >
          {data.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={entry.color} />
          ))}
          {/* Eliminamos los títulos de servicio dentro de las barras */}
          <LabelList
            dataKey="value"
            position="right"
            offset={8}
            className="fill-foreground"
            fontSize={12}
            formatter={(value: { toLocaleString: () => any }) =>
              `$${value.toLocaleString()}`
            }
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
