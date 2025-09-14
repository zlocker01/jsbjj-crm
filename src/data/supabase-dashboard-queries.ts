import { createClient } from '@/utils/supabase/client';
import type {
  MetricData,
  ServiceRevenueData,
  AppointmentByDayData,
  AppointmentByServiceData,
  ClientSegmentData,
  AppointmentStatusData,
  RevenueData,
  ClientGrowthData,
  ClientRetentionData,
  ClientSatisfactionData,
} from '@/interfaces/dashboard';

// Inicializar el cliente de Supabase
const supabase = createClient();

// Función para obtener datos de ingresos por servicio desde Supabase
export async function getServiceRevenueDataFromSupabase(): Promise<ServiceRevenueData[]> {
  try {
    const { data, error } = await supabase.rpc('get_service_revenue_data');
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      // Asignar colores a los servicios
      const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F', '#FFBB28', '#FF8042'];
      
      return data.map((item: any, index: number) => ({
        name: item.service_name,
        value: item.appointment_count,
        color: colors[index % colors.length],
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching service revenue data:', error);
    return [];
  }
}

// Función para obtener datos de citas por día desde Supabase
export async function getAppointmentsByDayFromSupabase(): Promise<AppointmentByDayData[]> {
  try {
    const { data, error } = await supabase.rpc('get_appointments_by_day');
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data.map((item: any) => ({
        day: item.day_name,
        citas: item.appointment_count,
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching appointments by day:', error);
    return [];
  }
}

// Función para obtener datos de citas por servicio desde Supabase
export async function getAppointmentsByServiceFromSupabase(): Promise<AppointmentByServiceData[]> {
  try {
    const { data, error } = await supabase.rpc('get_appointments_by_service');
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      // Asignar colores a los servicios
      const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F', '#FFBB28', '#FF8042'];
      
      return data.map((item: any, index: number) => ({
        name: item.service_name,
        value: item.appointment_count,
        color: colors[index % colors.length],
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching appointments by service:', error);
    return [];
  }
}

// Función para obtener datos de crecimiento de clientes desde Supabase
export async function getClientGrowthDataFromSupabase(): Promise<ClientGrowthData[]> {
  try {
    const { data, error } = await supabase.rpc('get_client_growth_data');
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data;
    }
    
    // Datos de respaldo en caso de no encontrar resultados
    return [
      { month: "Ene", nuevos: 15, perdidos: 5, total: 120 },
      { month: "Feb", nuevos: 12, perdidos: 3, total: 129 },
      { month: "Mar", nuevos: 18, perdidos: 4, total: 143 },
      { month: "Abr", nuevos: 14, perdidos: 6, total: 151 },
      { month: "May", nuevos: 10, perdidos: 4, total: 157 },
      { month: "Jun", nuevos: 16, perdidos: 5, total: 168 },
    ];
  } catch (error) {
    console.error('Error fetching client growth data:', error);
    // Datos de respaldo en caso de error
    return [
      { month: "Ene", nuevos: 15, perdidos: 5, total: 120 },
      { month: "Feb", nuevos: 12, perdidos: 3, total: 129 },
      { month: "Mar", nuevos: 18, perdidos: 4, total: 143 },
      { month: "Abr", nuevos: 14, perdidos: 6, total: 151 },
      { month: "May", nuevos: 10, perdidos: 4, total: 157 },
      { month: "Jun", nuevos: 16, perdidos: 5, total: 168 },
    ];
  }
}

// Función para obtener datos de segmentación de clientes desde Supabase
export async function getClientSegmentDataFromSupabase(): Promise<ClientSegmentData[]> {
  try {
    const { data, error } = await supabase.rpc('get_client_segmentation_data');
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data;
    }
    
    // Datos de respaldo en caso de no encontrar resultados
    return [
      { name: "Nuevos (0-3 meses)", value: 65, color: "#8884d8" },
      { name: "Ocasionales (1-3 visitas/año)", value: 85, color: "#82ca9d" },
      { name: "Regulares (4-8 visitas/año)", value: 45, color: "#ffc658" },
      { name: "Frecuentes (9+ visitas/año)", value: 30, color: "#ff8042" },
      { name: "VIP (Top 10% en gasto)", value: 20, color: "#0088fe" },
    ];
  } catch (error) {
    console.error('Error fetching client segmentation data:', error);
    // Datos de respaldo en caso de error
    return [
      { name: "Nuevos (0-3 meses)", value: 65, color: "#8884d8" },
      { name: "Ocasionales (1-3 visitas/año)", value: 85, color: "#82ca9d" },
      { name: "Regulares (4-8 visitas/año)", value: 45, color: "#ffc658" },
      { name: "Frecuentes (9+ visitas/año)", value: 30, color: "#ff8042" },
      { name: "VIP (Top 10% en gasto)", value: 20, color: "#0088fe" },
    ];
  }
}

// Función para obtener datos de retención de clientes desde Supabase
export async function getClientRetentionDataFromSupabase(): Promise<ClientRetentionData[]> {
  try {
    const { data, error } = await supabase.rpc('get_client_retention_data');
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data;
    }
    
    // Datos de respaldo en caso de no encontrar resultados
    return [
      { month: "Ene", tasa: 92 },
      { month: "Feb", tasa: 94 },
      { month: "Mar", tasa: 91 },
      { month: "Abr", tasa: 88 },
      { month: "May", tasa: 90 },
      { month: "Jun", tasa: 93 },
    ];
  } catch (error) {
    console.error('Error fetching client retention data:', error);
    // Datos de respaldo en caso de error
    return [
      { month: "Ene", tasa: 92 },
      { month: "Feb", tasa: 94 },
      { month: "Mar", tasa: 91 },
      { month: "Abr", tasa: 88 },
      { month: "May", tasa: 90 },
      { month: "Jun", tasa: 93 },
    ];
  }
}

// Función para obtener datos de satisfacción de clientes desde Supabase
export async function getClientSatisfactionDataFromSupabase(): Promise<ClientSatisfactionData[]> {
  try {
    const { data, error } = await supabase.rpc('get_client_satisfaction_data');
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data;
    }
    
    // Datos de respaldo en caso de no encontrar resultados
    return [
      { aspect: "Atención", valor: 4.8, fullMark: 5 },
      { aspect: "Calidad", valor: 4.6, fullMark: 5 },
      { aspect: "Precio", valor: 4.2, fullMark: 5 },
      { aspect: "Instalaciones", valor: 4.5, fullMark: 5 },
      { aspect: "Puntualidad", valor: 4.3, fullMark: 5 },
      { aspect: "Resultados", valor: 4.7, fullMark: 5 },
    ];
  } catch (error) {
    console.error('Error fetching client satisfaction data:', error);
    // Datos de respaldo en caso de error
    return [
      { aspect: "Atención", valor: 4.8, fullMark: 5 },
      { aspect: "Calidad", valor: 4.6, fullMark: 5 },
      { aspect: "Precio", valor: 4.2, fullMark: 5 },
      { aspect: "Instalaciones", valor: 4.5, fullMark: 5 },
      { aspect: "Puntualidad", valor: 4.3, fullMark: 5 },
      { aspect: "Resultados", valor: 4.7, fullMark: 5 },
    ];
  }
}

// Función para obtener datos de fuentes de clientes desde Supabase
export async function getClientSourcesFromSupabase(): Promise<ClientSegmentData[]> {
  try {
    const { data, error } = await supabase.rpc('get_client_sources');
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      // Asignar colores a las fuentes
      const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];
      
      return data.map((item: any, index: number) => ({
        name: item.client_source,
        value: item.client_count,
        color: colors[index % colors.length],
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching client sources:', error);
    return [];
  }
}

// Función para obtener datos de estado de citas desde Supabase
export async function getAppointmentStatusDataFromSupabase(): Promise<AppointmentStatusData[]> {
  try {
    // En lugar de usar .group() que no existe en PostgrestFilterBuilder,
    // usamos una función RPC personalizada o una consulta SQL
    const { data, error } = await supabase.rpc('get_appointment_status_data');
    
    // Alternativa si no existe la función RPC:
    // const { data, error } = await supabase
    //   .from('appointments')
    //   .select('status, count(*)')
    //   .or('status.eq.completed,status.eq.cancelled,status.eq.no_show')
    //   .in('status', ['completed', 'cancelled', 'no_show'])
    //   .group('status');
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      // Mapear los estados a nombres más amigables y asignar colores
      const statusMap: Record<string, { name: string, color: string }> = {
        completed: { name: 'Completadas', color: '#4CAF50' },
        cancelled: { name: 'Canceladas', color: '#F44336' },
        no_show: { name: 'No asistidas', color: '#FF9800' }
      };
      
      return data.map((item: any) => ({
        name: statusMap[item.status]?.name || item.status,
        value: parseInt(item.count),
        color: statusMap[item.status]?.color || '#999999',
      }));
    }
    
    // Datos de respaldo en caso de no encontrar resultados
    return [
      { name: "Completadas", value: 75, color: "#4CAF50" },
      { name: "Canceladas", value: 15, color: "#F44336" },
      { name: "No asistidas", value: 10, color: "#FF9800" },
    ];
  } catch (error) {
    console.error('Error fetching appointment status data:', error);
    // Datos de respaldo en caso de error
    return [
      { name: "Completadas", value: 75, color: "#4CAF50" },
      { name: "Canceladas", value: 15, color: "#F44336" },
      { name: "No asistidas", value: 10, color: "#FF9800" },
    ];
  }
}

// Función para obtener datos de ingresos desde Supabase
export async function getRevenueDataFromSupabase(timeRange: 'monthly' | 'weekly' = 'monthly'): Promise<RevenueData[]> {
  try {
    // Obtener datos de ingresos y gastos
    const { data, error } = await supabase.rpc('get_revenue_data', { time_range: timeRange });
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data.map((item: any) => ({
        name: item.period,
        ingresos: item.revenue || 0,
        gastos: item.expenses || 0,
        beneficio: (item.revenue || 0) - (item.expenses || 0),
      }));
    }
    
    // Datos de respaldo en caso de no encontrar resultados
    if (timeRange === 'monthly') {
      return [
        { name: "Ene", ingresos: 2400, gastos: 1800, beneficio: 600 },
        { name: "Feb", ingresos: 1398, gastos: 1100, beneficio: 298 },
        { name: "Mar", ingresos: 9800, gastos: 6200, beneficio: 3600 },
        { name: "Abr", ingresos: 3908, gastos: 2800, beneficio: 1108 },
        { name: "May", ingresos: 4800, gastos: 3200, beneficio: 1600 },
        { name: "Jun", ingresos: 3800, gastos: 2900, beneficio: 900 },
      ];
    } else {
      return [
        { name: "Sem 1", ingresos: 1200, gastos: 900, beneficio: 300 },
        { name: "Sem 2", ingresos: 1400, gastos: 1000, beneficio: 400 },
        { name: "Sem 3", ingresos: 1600, gastos: 1100, beneficio: 500 },
        { name: "Sem 4", ingresos: 1800, gastos: 1200, beneficio: 600 },
      ];
    }
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    // Datos de respaldo en caso de error
    if (timeRange === 'monthly') {
      return [
        { name: "Ene", ingresos: 2400, gastos: 1800, beneficio: 600 },
        { name: "Feb", ingresos: 1398, gastos: 1100, beneficio: 298 },
        { name: "Mar", ingresos: 9800, gastos: 6200, beneficio: 3600 },
        { name: "Abr", ingresos: 3908, gastos: 2800, beneficio: 1108 },
        { name: "May", ingresos: 4800, gastos: 3200, beneficio: 1600 },
        { name: "Jun", ingresos: 3800, gastos: 2900, beneficio: 900 },
      ];
    } else {
      return [
        { name: "Sem 1", ingresos: 1200, gastos: 900, beneficio: 300 },
        { name: "Sem 2", ingresos: 1400, gastos: 1000, beneficio: 400 },
        { name: "Sem 3", ingresos: 1600, gastos: 1100, beneficio: 500 },
        { name: "Sem 4", ingresos: 1800, gastos: 1200, beneficio: 600 },
      ];
    }
  }
}

// Función para obtener datos de métricas generales desde Supabase
export async function getMetricsDataFromSupabase(): Promise<MetricData[]> {
  try {
    // Obtener datos de citas por mes
    const { data: appointmentsData, error: appointmentsError } = await supabase
      .from('appointments')
      .select('created_at')
      .order('created_at');
    
    if (appointmentsError) throw appointmentsError;
    
    // Obtener datos de clientes por mes
    const { data: clientsData, error: clientsError } = await supabase
      .from('clients')
      .select('created_at')
      .order('created_at');
    
    if (clientsError) throw clientsError;
    
    // Obtener datos de ingresos por mes (usando appointments y services)
    const { data: revenueData, error: revenueError } = await supabase
      .from('appointments')
      .select('created_at, services(price)')
      .eq('status', 'completed')
      .order('created_at');
    
    if (revenueError) throw revenueError;
    
    // Procesar los datos por mes
    const months = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    
    const currentYear = new Date().getFullYear();
    const result: MetricData[] = [];
    
    for (let i = 0; i < 12; i++) {
      const monthData: MetricData = {
        name: months[i],
        citas: 0,
        ingresos: 0,
        clientes: 0
      };
      
      // Contar citas para este mes
      if (appointmentsData) {
        monthData.citas = appointmentsData.filter(item => {
          const date = new Date(item.created_at);
          return date.getMonth() === i && date.getFullYear() === currentYear;
        }).length;
      }
      
      // Contar clientes para este mes
      if (clientsData) {
        monthData.clientes = clientsData.filter(item => {
          const date = new Date(item.created_at);
          return date.getMonth() === i && date.getFullYear() === currentYear;
        }).length;
      }
      
      // Calcular ingresos para este mes
      if (revenueData) {
        monthData.ingresos = revenueData
          .filter(item => {
            const date = new Date(item.created_at);
            return date.getMonth() === i && date.getFullYear() === currentYear;
          })
          .reduce((sum, item) => {
            // Extraer el precio de manera segura independientemente de la estructura
            const services = item.services;
            
            // Si es un array, sumar los precios de todos los elementos
            if (Array.isArray(services)) {
              return sum + services.reduce((total, s) => total + (s?.price || 0), 0);
            }
            
            // Si es un objeto con price, usar ese valor
            const price = services && typeof services === 'object' ? (services as { price?: number }).price || 0 : 0;
            return sum + price;
          }, 0);
      }
      
      result.push(monthData);
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching metrics data:', error);
    // Datos de respaldo en caso de error
    return [
      { name: "Ene", citas: 40, ingresos: 2400, clientes: 24 },
      { name: "Feb", citas: 30, ingresos: 1398, clientes: 22 },
      { name: "Mar", citas: 20, ingresos: 9800, clientes: 29 },
      { name: "Abr", citas: 27, ingresos: 3908, clientes: 20 },
      { name: "May", citas: 18, ingresos: 4800, clientes: 21 },
      { name: "Jun", citas: 23, ingresos: 3800, clientes: 25 },
    ];
  }
}