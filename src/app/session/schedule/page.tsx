
"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkingHours } from "@/components/schedule/working-hours";
import { NonWorkingDays } from "@/components/schedule/non-working-days";
import { useToast } from "@/components/ui/use-toast";
import type { Schedule } from "@/interfaces/schedule/Schedule";

const dayIds = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

// Función para transformar la lista de horarios al formato Record
const transformSchedulesToRecord = (
  schedulesFromApi: Schedule[],
): Record<string, Schedule | undefined> => {
  const record: Record<string, Schedule | undefined> = {};
  dayIds.forEach((dayId) => {
    // Asegúrate que 'day_of_week' en tu BD coincida con estos identificadores (ej: 'monday')
    const scheduleForDay = schedulesFromApi.find(
      (s) => s.day_of_week.toLowerCase() === dayId,
    );
    record[dayId] = scheduleForDay;
  });
  return record;
};

// Estado inicial vacío o con estructura base
const initialWorkingHoursState = (): Record<string, Schedule | undefined> => {
  const state: Record<string, Schedule | undefined> = {};
  dayIds.forEach((dayId) => {
    state[dayId] = undefined; // O una estructura base si prefieres
  });
  return state;
};

export default function SchedulePage() {
  const { toast } = useToast();

  // Estado para los horarios, inicializado para que coincida con la interfaz Schedule
  const [workingHours, setWorkingHours] = useState<
    Record<string, Schedule | undefined>
  >(initialWorkingHoursState());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/schedule");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch schedules");
        }
        const data = await response.json();
        const transformedData = transformSchedulesToRecord(
          data.schedules || [],
        );
        setWorkingHours(transformedData);
      } catch (error) {
        console.error("Error fetching schedules:", error);
        toast({
          title: "Error al cargar horarios",
          description:
            error instanceof Error
              ? error.message
              : "No se pudieron obtener los horarios.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, [toast]); // toast como dependencia si se usa dentro del catch para mostrar errores

  const [nonWorkingDays, setNonWorkingDays] = useState([
    { date: "2023-12-25", description: "Navidad" },
    { date: "2024-01-01", description: "Año Nuevo" },
    { date: "2024-04-19", description: "Viernes Santo" },
  ]);

  // Renombrado a handleLocalScheduleChange y ajustado para la interfaz Schedule
  const handleLocalScheduleChange = (
    dayId: string,
    changedData: Partial<Schedule>,
  ) => {
    setWorkingHours((prevSchedules) => {
      const currentDayData = prevSchedules[dayId];
      // Si no hay datos actuales y no hay ID, es una nueva entrada potencial (no manejado por update)
      // Para la actualización optimista, asumimos que currentDayData existe si changedData no es una creación completa
      const updatedDayData = {
        ...(currentDayData || {
          day_of_week: dayId,
          user_id: "",
          is_working_day: false,
        }), // Proporciona un esqueleto si no existe
        ...changedData,
      } as Schedule; // Forzamos el tipo aquí, asumiendo que los campos necesarios están

      return {
        ...prevSchedules,
        [dayId]: updatedDayData,
      };
    });
  };

  const handleNonWorkingDaysChange = (days: any[]) => {
    setNonWorkingDays(days);
  };

  const handleSave = () => {
    // La lógica de guardado para WorkingHours ya ocurre en tiempo real dentro del componente.
    // Este botón podría usarse para guardar NonWorkingDays o realizar otras acciones globales.
    toast({
      title: "Configuración guardada",
      description:
        "La configuración de horarios ha sido guardada correctamente.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-screen">
        <p className="text-xl">Cargando configuración de horarios...</p>
        {/* Podrías agregar un spinner aquí */}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Gestión de Horarios
        </h1>
        <p className="text-muted-foreground">
          Configura tus horarios de trabajo y días no laborables
        </p>
      </div>

      <Tabs defaultValue="working-hours" className="space-y-4">
        <TabsList>
          <TabsTrigger value="working-hours">Horarios de Trabajo</TabsTrigger>
          <TabsTrigger value="non-working-days">Días No Laborables</TabsTrigger>
        </TabsList>
        <TabsContent value="working-hours">
          <Card>
            <CardHeader>
              <CardTitle>Horarios de Trabajo</CardTitle>
              <CardDescription>
                Define tus horarios de trabajo para cada día de la semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WorkingHours
                workingHours={workingHours}
                onLocalChange={handleLocalScheduleChange} // Cambiado de onChange a onLocalChange
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="non-working-days">
          <Card>
            <CardHeader>
              <CardTitle>Días No Laborables</CardTitle>
              <CardDescription>
                Configura días festivos o vacaciones en los que no trabajarás
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NonWorkingDays />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
