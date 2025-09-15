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
  Tooltip,
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
import { getServiceRevenueDataFromSupabase } from '@/data/supabase-dashboard-queries';

interface ServiceRevenueChartProps {
  data?: ServiceRevenueData[];
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

// Componente para el tooltip personalizado
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background p-2 rounded-md shadow-md border border-border">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-muted-foreground">
          Ingresos: {data.value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
        </p>
      </div>
    );
  }
  return null;
};

export function ServiceRevenueChart({ data: propData }: ServiceRevenueChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState<ServiceRevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    setIsMounted(true);
    
    // Si se proporcionan datos como prop, úsalos
    if (propData && propData.length > 0) {
      setData(propData);
      setLoading(false);
      return;
    }
    
    // De lo contrario, obtén datos de Supabase
    const fetchData = async () => {
      try {
        const serviceData = await getServiceRevenueDataFromSupabase();
        if (serviceData.length > 0) {
          setData(serviceData);
        } else {
          // Si no hay datos de Supabase, usa datos de ejemplo
          setData([
            { name: "Corte para caballero", value: 48, color: '#8884d8' },
            { name: "Corte para dama", value: 44, color: '#82ca9d' },
            { name: "Perfilado de Cejas", value: 13, color: '#ffc658' },
            { name: "Esmaltado Gelish", value: 11, color: '#ff8042' },
            { name: "Corte Infantil", value: 9, color: '#0088fe' },
          ]);
        }
      } catch (err) {
        console.error('Error fetching service data:', err);
        setError('Error al cargar los datos. Inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [propData]);

  if (!isMounted || loading) {
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

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex h-[300px] w-full items-center justify-center">
            <p className="text-muted-foreground">{error}</p>
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
        <Tooltip content={<CustomTooltip />} />
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
            formatter={(value: number) => value.toLocaleString()}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
