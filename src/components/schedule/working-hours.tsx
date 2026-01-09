'use client';

import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { Schedule } from '@/interfaces/schedule/Schedule';
import type { UpdateScheduleData } from '@/data/schedule/updateSchedule';

interface WorkingHoursProps {
  // workingHours es un mapa donde la clave es day.id (ej: 'monday')
  // y el valor es el objeto Schedule completo para ese día, o undefined.
  // Este objeto Schedule DEBE incluir su 'id' de la base de datos si es un horario existente.
  workingHours: Record<string, Schedule | undefined>;
  // onLocalChange es llamado para informar al padre de los cambios locales para actualizaciones optimistas de UI.
  // El padre debe actualizar su estado, que luego fluye de regreso como la prop 'workingHours'.
  onLocalChange: (dayId: string, changedData: Partial<Schedule>) => void;
}

const daysOfWeek = [
  { id: 'monday', label: 'Lunes' },
  { id: 'tuesday', label: 'Martes' },
  { id: 'wednesday', label: 'Miércoles' },
  { id: 'thursday', label: 'Jueves' },
  { id: 'friday', label: 'Viernes' },
  { id: 'saturday', label: 'Sábado' },
  { id: 'sunday', label: 'Domingo' },
];

export function WorkingHours({
  workingHours,
  onLocalChange,
}: WorkingHoursProps) {
  const { toast } = useToast();

  const getDayLabel = (dayId: string) => {
    const day = daysOfWeek.find((d) => d.id === dayId);
    return day ? day.label : dayId;
  };

  const handleApiUpdate = async (
    scheduleId: number | bigint,
    payload: UpdateScheduleData,
    dayId: string // Usamos dayId para que onLocalChange pueda recibirlo si es necesario revertir
  ) => {
    const dayLabel = getDayLabel(dayId);
    try {
      const response = await fetch(`/api/schedule/${scheduleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // const result = await response.json(); // Contiene { message, schedule }
        // onLocalChange ya actualizó la UI optimistamente.
        // Si se quisiera asegurar consistencia con el objeto devuelto por la API:
        // onLocalChange(dayId, result.schedule);
        toast({
          title: 'Horario Actualizado',
          description: `El horario para ${dayLabel} ha sido actualizado.`,
          variant: 'success',
        });
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error al actualizar',
          description: `No se pudo actualizar ${dayLabel}: ${
            errorData.error || response.statusText
          }`,
          variant: 'destructive',
        });
        // Aquí se podría implementar una lógica para revertir la actualización optimista
        // llamando a onLocalChange con los datos originales, si el padre lo soporta.
      }
    } catch (error) {
      console.error(`API update error for ${dayLabel}:`, error);
      toast({
        title: 'Error de Red',
        description: `Ocurrió un error al conectar con el servidor para actualizar ${dayLabel}.`,
        variant: 'destructive',
      });
    }
  };

  const handleToggleDay = (dayId: string) => {
    const currentDaySchedule = workingHours[dayId];

    if (!currentDaySchedule || typeof currentDaySchedule.id === 'undefined') {
      toast({
        title: 'Acción no permitida',
        description: `No hay un horario base para ${getDayLabel(
          dayId
        )} en la base de datos. Esta acción requiere crear un nuevo horario.`,
        variant: 'destructive',
      });
      return;
    }

    const newIsWorkingDay = !currentDaySchedule.is_working_day;

    // 1. Actualización optimista de UI a través del padre
    onLocalChange(dayId, { is_working_day: newIsWorkingDay });

    // 2. Llamada a la API
    const payload: UpdateScheduleData = { is_working_day: newIsWorkingDay };
    handleApiUpdate(currentDaySchedule.id, payload, dayId);
  };

  const handleTimeChange = (
    dayId: string,
    field: keyof UpdateScheduleData, // Especifica que field es una clave válida de UpdateScheduleData
    value: string
  ) => {
    const currentDaySchedule = workingHours[dayId];

    if (!currentDaySchedule || typeof currentDaySchedule.id === 'undefined') {
      toast({
        title: 'Acción no permitida',
        description: `No hay un horario base para ${getDayLabel(
          dayId
        )} en la base de datos.`,
        variant: 'destructive',
      });
      return;
    }

    const valueForApi = value === '' ? null : value;

    // 1. Actualización optimista
    onLocalChange(dayId, { [field]: valueForApi });

    // Validación: No enviar a la API si es un campo obligatorio y el valor es nulo
    if (
      (field === 'start_time' || field === 'end_time') &&
      valueForApi === null
    ) {
      return;
    }

    // 2. Llamada a la API
    // Aseguramos que el payload solo contenga el campo que cambia
    const payload: UpdateScheduleData = {
      [field]: valueForApi,
    } as UpdateScheduleData;
    handleApiUpdate(currentDaySchedule.id, payload, dayId);
  };

  return (
    <div className="space-y-6">
      {daysOfWeek.map((day) => {
        const currentSchedule = workingHours[day.id];
        const isDayWorking = currentSchedule?.is_working_day || false;
        const scheduleExistsInDb = typeof currentSchedule?.id !== 'undefined';

        return (
          <div key={day.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={`${day.id}-toggle`} className="font-medium">
                {day.label}
              </Label>
              <Switch
                id={`${day.id}-toggle`}
                checked={isDayWorking}
                onCheckedChange={() => handleToggleDay(day.id)}
                // El switch se puede operar; handleToggleDay decidirá si la acción es válida.
              />
            </div>

            {isDayWorking && ( // Mostrar inputs solo si el día está marcado como laborable
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor={`${day.id}-start`}>Hora de inicio</Label>
                  <Input
                    id={`${day.id}-start`}
                    type="time"
                    value={currentSchedule?.start_time || ''}
                    onChange={(e) =>
                      handleTimeChange(day.id, 'start_time', e.target.value)
                    }
                    disabled={!scheduleExistsInDb} // Deshabilitado si no hay ID de BD
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${day.id}-end`}>Hora de fin</Label>
                  <Input
                    id={`${day.id}-end`}
                    type="time"
                    value={currentSchedule?.end_time || ''}
                    onChange={(e) =>
                      handleTimeChange(day.id, 'end_time', e.target.value)
                    }
                    disabled={!scheduleExistsInDb}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${day.id}-break-start`}>
                    Inicio de descanso (opcional)
                  </Label>
                  <Input
                    id={`${day.id}-break-start`}
                    type="time"
                    value={currentSchedule?.break_start_time || ''}
                    onChange={(e) =>
                      handleTimeChange(
                        day.id,
                        'break_start_time',
                        e.target.value
                      )
                    }
                    disabled={!scheduleExistsInDb}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${day.id}-break-end`}>
                    Fin de descanso (opcional)
                  </Label>
                  <Input
                    id={`${day.id}-break-end`}
                    type="time"
                    value={currentSchedule?.break_end_time || ''}
                    onChange={(e) =>
                      handleTimeChange(day.id, 'break_end_time', e.target.value)
                    }
                    disabled={!scheduleExistsInDb}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
