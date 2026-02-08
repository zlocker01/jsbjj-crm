'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  addDays,
  addMonths,
  addWeeks,
  endOfMonth,
  format,
  isBefore,
  isSameMonth,
  isSameDay,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Schedule } from '@/interfaces/schedule/Schedule';

const formSchema = z.object({
  service: z
    .string({
      required_error: 'Por favor selecciona un servicio',
    })
    .or(z.literal('')),
  promotion: z
    .string({
      required_error: 'Por favor selecciona una promoción',
    })
    .or(z.literal('')),
  // stylist: z.string({
  //   required_error: "Por favor selecciona un estilista",
  // }),
  date: z.date({
    required_error: 'Por favor selecciona una fecha',
  }),
  time: z.string({
    required_error: 'Por favor selecciona una hora',
  }),
  name: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres',
  }),
  email: z.string().email({
    message: 'Por favor ingresa un correo electrónico válido',
  }),
  phone: z.string().min(10, {
    message: 'Por favor ingresa un número de teléfono válido',
  }),
  notes: z.string().optional(),
});

export default function Booking({ landingId = '' }: { landingId?: string }) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isLoadingPromotions, setIsLoadingPromotions] = useState(true);
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  const [selectedWeekStart, setSelectedWeekStart] = useState<Date | null>(null);
  // const [stylists, setStylists] = useState<any[]>([]); // No implementado

  // Cargar servicios, promociones y citas al montar
  React.useEffect(() => {
    console.log('LandingId recibido en component:', landingId);
    if (!landingId) {
      console.warn(
        'landingId no proporcionado o inválido. Algunos datos no estarán disponibles.',
      );
      setIsLoadingServices(false);
      setIsLoadingPromotions(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoadingServices(true);
        // Cargar servicios
        try {
          console.log('Solicitando servicios con landingId:', landingId);
          const resServices = await fetch(
            `/api/services?landingPageId=${landingId}`,
          );
          console.log(
            'Respuesta de API servicios:',
            resServices.status,
            resServices.statusText,
          );

          if (!resServices.ok) {
            const errorText = await resServices.text();
            console.error('Error al cargar servicios:', errorText);
            toast({
              title: 'Error cargando servicios',
              variant: 'destructive',
            });
          } else {
            const dataServices = await resServices.json();
            console.log('Servicios recibidos (datos brutos):', dataServices);
            if (dataServices && Array.isArray(dataServices.services)) {
              console.log(
                'Número de servicios encontrados:',
                dataServices.services.length,
              );
              setServices(dataServices.services);
            } else {
              console.warn(
                'La estructura de datos de servicios no es la esperada:',
                dataServices,
              );
            }
          }
        } catch (serviceErr) {
          console.error('Excepción al cargar servicios:', serviceErr);
        }
        setIsLoadingServices(false);

        setIsLoadingPromotions(true);
        // Cargar promociones
        try {
          console.log('Solicitando promociones con landingId:', landingId);
          const resPromotions = await fetch(
            `/api/promotions?landingPageId=${landingId}`,
          );
          console.log(
            'Respuesta de API promociones:',
            resPromotions.status,
            resPromotions.statusText,
          );

          if (!resPromotions.ok) {
            const errorText = await resPromotions.text();
            console.error('Error al cargar promociones:', errorText);
            toast({
              title: 'Error cargando promociones',
              variant: 'destructive',
            });
          } else {
            const dataPromotions = await resPromotions.json();
            console.log(
              'Promociones recibidas (datos brutos):',
              dataPromotions,
            );
            if (dataPromotions && Array.isArray(dataPromotions.promotions)) {
              console.log(
                'Número de promociones encontradas:',
                dataPromotions.promotions.length,
              );
              setPromotions(dataPromotions.promotions);
            } else {
              console.warn(
                'La estructura de datos de promociones no es la esperada:',
                dataPromotions,
              );
              console.log('Usando datos de prueba para promociones');
            }
          }
        } catch (promoErr) {
          console.error('Excepción al cargar promociones:', promoErr);
        }
        setIsLoadingPromotions(false);

        // Cargar horarios
        try {
          const resSchedules = await fetch('/api/schedule');
          if (resSchedules.ok) {
            const dataSchedules = await resSchedules.json();
            if (dataSchedules && Array.isArray(dataSchedules.schedules)) {
              setSchedules(dataSchedules.schedules);
            }
          } else {
            console.error('Error fetching schedules:', resSchedules.statusText);
          }
        } catch (schedErr) {
          console.error('Exception fetching schedules:', schedErr);
        }
      } catch (err) {
        console.error('Error general:', err);
        toast({
          title: 'Error cargando datos necesarios',
          variant: 'destructive',
        });
        setIsLoadingServices(false);
        setIsLoadingPromotions(false);
      }
    };
    fetchData();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: '',
      name: '',
      email: '',
      phone: '',
      time: '',
    },
    mode: 'onChange', // Validar al cambiar los campos
  });

  const watchService = form.watch('service');
  const watchPromotion = form.watch('promotion');
  const watchDate = form.watch('date');

  const generateAvailableTimeSlots = (bookedTimes: string[]) => {
    const openingHour = 9;
    const closingHour = 19;
    const allPossibleSlots: string[] = [];
    for (let hour = openingHour; hour < closingHour; hour++) {
      allPossibleSlots.push(`${hour}:00`);
      if (hour < closingHour - 1) {
        allPossibleSlots.push(`${hour}:30`);
      }
    }
    return allPossibleSlots.filter((slot) => !bookedTimes.includes(slot));
  };

  React.useEffect(() => {
    let cancelled = false;
    const loadAvailableSlots = async () => {
      if (!watchDate) {
        setAvailableTimeSlots([]);
        return;
      }

      setIsLoadingTimeSlots(true);
      try {
        const resAppointments = await fetch(`/api/appointments`);
        if (!resAppointments.ok) {
          toast({ title: 'Error cargando citas', variant: 'destructive' });
          setAvailableTimeSlots([]);
          return;
        }

        const dataAppointments = await resAppointments.json();
        const allAppointments = dataAppointments?.data ?? [];

        const selectedDateStr = format(watchDate, 'yyyy-MM-dd');

        // Obtener duración del servicio seleccionado para calcular el fin del slot candidato
        const currentServiceId = watchService;
        const currentService = services.find(
          (s: any) => s.id.toString() === currentServiceId,
        );
        const serviceDurationMinutes = currentService?.duration_minutes || 30; // Default 30 min

        // 1. Filtrar citas del día seleccionado
        const dayAppointments = allAppointments.filter((appointment: any) => {
          if (!appointment.start_datetime || appointment.status === 'Cancelada')
            return false;
          const appointmentDate = new Date(appointment.start_datetime);
          return format(appointmentDate, 'yyyy-MM-dd') === selectedDateStr;
        });

        // 2. Generar slots y verificar COLISIÓN DE RANGOS (Overlap)

        // --- Integración con Working Hours ---
        const daysMap = [
          'sunday',
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
        ];
        const dayName = daysMap[watchDate.getDay()];

        // Buscar horario del día
        const daySchedule =
          schedules.length > 0
            ? schedules.find((s) => s.day_of_week === dayName)
            : null;

        // Defaults si no hay schedules cargados (fallback a 9-19)
        let startH = 9,
          startM = 0;
        let endH = 19,
          endM = 0;
        let isWorkingDay = true;

        let breakStartMs = 0;
        let breakEndMs = 0;

        const parseTimeStr = (timeStr: string) => {
          const [h, m] = timeStr.split(':').map(Number);
          return { h, m };
        };

        // Asegurar que partimos de la medianoche local del día seleccionado
        const watchDateStart = startOfDay(watchDate);

        if (schedules.length > 0) {
          if (!daySchedule || !daySchedule.is_working_day) {
            isWorkingDay = false;
          } else {
            const start = parseTimeStr(daySchedule.start_time || '09:00');
            startH = start.h;
            startM = start.m;

            const end = parseTimeStr(daySchedule.end_time || '19:00');
            endH = end.h;
            endM = end.m;

            if (daySchedule.break_start_time && daySchedule.break_end_time) {
              const bStart = parseTimeStr(daySchedule.break_start_time);
              const bEnd = parseTimeStr(daySchedule.break_end_time);

              const bsDate = new Date(watchDateStart);
              bsDate.setHours(bStart.h, bStart.m, 0, 0);
              breakStartMs = bsDate.getTime();

              const beDate = new Date(watchDateStart);
              beDate.setHours(bEnd.h, bEnd.m, 0, 0);
              breakEndMs = beDate.getTime();
            }
          }
        }

        if (!isWorkingDay) {
          setAvailableTimeSlots([]);
          setIsLoadingTimeSlots(false);
          return;
        }

        const openingHour = startH;
        // Si termina 19:30, iterar hasta 20 para que el bucle cubra la hora 19
        const closingHour = endH + (endM > 0 ? 1 : 0);
        const availableSlots: string[] = [];

        // Límite absoluto de cierre para hoy
        const closingDate = new Date(watchDateStart);
        closingDate.setHours(endH, endM, 0, 0);
        const closingTimeMs = closingDate.getTime();

        // Límite absoluto de inicio
        const openingDate = new Date(watchDateStart);
        openingDate.setHours(startH, startM, 0, 0);
        const openingTimeMs = openingDate.getTime();

        for (let hour = openingHour; hour < closingHour; hour++) {
          const slotsToCheck = [`${hour}:00`, `${hour}:30`];

          slotsToCheck.forEach((slotTime) => {
            // Definir rango del SLOT CANDIDATO
            const [h, m] = slotTime.split(':').map(Number);
            const slotStart = new Date(watchDateStart);
            slotStart.setHours(h, m, 0, 0);
            const slotStartTime = slotStart.getTime();

            // Duración del servicio que se quiere agendar
            const slotEndTime =
              slotStartTime + serviceDurationMinutes * 60 * 1000;

            // 1. Validaciones de Horario Laboral
            if (slotStartTime < openingTimeMs) return; // Antes de abrir
            if (slotEndTime > closingTimeMs) return; // Después de cerrar

            // Chequeo de descanso
            if (breakStartMs && breakEndMs) {
              if (slotStartTime < breakEndMs && slotEndTime > breakStartMs) {
                return; // Choca con descanso
              }
            }

            // 2. Regla de negocio: No chocar con citas existentes
            const isOccupied = dayAppointments.some((app: any) => {
              const appStart = new Date(app.start_datetime).getTime();

              // Calcular fin de la cita existente de forma robusta
              let appEnd: number;
              if (app.end_datetime) {
                appEnd = new Date(app.end_datetime).getTime();
              } else if (app.actual_duration_minutes) {
                appEnd = appStart + app.actual_duration_minutes * 60 * 1000;
              } else {
                // Intentar buscar duración del servicio original si está disponible en 'services'
                // Nota: app.service_id debe coincidir con el tipo de ID en services (string vs number)
                const originalService = services.find(
                  (s) => s.id == app.service_id,
                );
                const duration = originalService?.duration_minutes || 30;
                appEnd = appStart + duration * 60 * 1000;
              }

              // Fórmula de superposición: (StartA < EndB) && (EndA > StartB)
              const overlaps = slotStartTime < appEnd && slotEndTime > appStart;

              if (overlaps) {
                console.log(
                  `[DEBUG] Conflicto: Slot ${slotTime} (${new Date(
                    slotStartTime,
                  ).toLocaleTimeString()} - ${new Date(
                    slotEndTime,
                  ).toLocaleTimeString()}) choca con cita ${app.id} (${new Date(
                    appStart,
                  ).toLocaleTimeString()} - ${new Date(
                    appEnd,
                  ).toLocaleTimeString()})`,
                );
              }

              return overlaps;
            });

            if (!isOccupied) {
              availableSlots.push(slotTime);
            }
          });
        }
        if (!cancelled) {
          setAvailableTimeSlots(availableSlots);
        }
      } catch {
        if (!cancelled) {
          toast({ title: 'Error cargando citas', variant: 'destructive' });
          setAvailableTimeSlots([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingTimeSlots(false);
        }
      }
    };

    void loadAvailableSlots();
    return () => {
      cancelled = true;
    };
  }, [toast, watchDate, watchService, services, schedules]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al agendar la cita');
      }

      // Avanzar al paso de confirmación
      setStep(2);
      toast({
        title: '¡Cita agendada con éxito!',
        description: `Te esperamos el ${format(values.date, 'PPP', {
          locale: es,
        })} a las ${values.time}`,
        variant: 'success',
      });
    } catch (error: any) {
      console.error('Error submitting booking:', error);
      toast({
        title: 'Error al agendar',
        description:
          error.message ||
          'Hubo un problema al procesar tu solicitud. Intenta nuevamente.',
        variant: 'destructive',
      });
    }
  };

  const handleContinueToStep2 = async () => {
    // Validar todos los campos del paso 1
    const result = await form.trigger(
      ['service', /* "stylist", */ 'date', 'time', 'name', 'email', 'phone'],
      {
        shouldFocus: true,
      },
    );

    if (result) {
      form.handleSubmit(onSubmit)();
    } else {
      // Mostrar mensaje de error
      toast({
        title: 'Por favor completa todos los campos',
        description:
          'Todos los campos son obligatorios excepto las notas adicionales.',
        variant: 'destructive',
      });
    }
  };

  const monthOptions = React.useMemo(() => {
    const now = startOfMonth(new Date());
    return Array.from({ length: 12 }).map((_, index) => {
      const monthDate = startOfMonth(addMonths(now, index));
      return {
        key: format(monthDate, 'yyyy-MM'),
        label: format(monthDate, 'LLLL yyyy', { locale: es }),
        date: monthDate,
      };
    });
  }, []);

  const weekOptions = React.useMemo(() => {
    if (!selectedMonth) return [];

    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);
    const firstWeekStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const lastWeekStart = startOfWeek(monthEnd, { weekStartsOn: 1 });

    const weeks: { key: string; label: string; start: Date }[] = [];
    for (
      let weekStart = firstWeekStart;
      weekStart <= lastWeekStart;
      weekStart = addWeeks(weekStart, 1)
    ) {
      const weekEnd = addDays(weekStart, 6);
      weeks.push({
        key: format(weekStart, 'yyyy-MM-dd'),
        label: `${format(weekStart, 'd MMM', { locale: es })} - ${format(
          weekEnd,
          'd MMM',
          { locale: es },
        )}`,
        start: weekStart,
      });
    }
    return weeks;
  }, [selectedMonth]);

  const dayOptions = React.useMemo(() => {
    if (!selectedMonth || !selectedWeekStart) return [];
    const today = startOfDay(new Date());
    return Array.from({ length: 7 })
      .map((_, index) => addDays(selectedWeekStart, index))
      .filter((day) => isSameMonth(day, selectedMonth))
      .map((day) => {
        const disabled = isBefore(startOfDay(day), today) || day.getDay() === 0;
        return { day, disabled };
      });
  }, [selectedMonth, selectedWeekStart]);

  return (
    <section id="booking" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Agenda tu Cita
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Reserva tu cita en pocos pasos. Selecciona el servicio, profesional,
            fecha y hora que prefieras.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold',
                  step >= 1 ? 'bg-primary' : 'bg-muted',
                )}
              >
                1
              </div>
              <div className="ml-2">
                <p className="font-medium">Detalles</p>
              </div>
            </div>
            <div className="h-0.5 w-16 bg-muted flex-grow mx-4" />
            <div className="flex items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold',
                  step >= 2 ? 'bg-primary' : 'bg-muted',
                )}
              >
                2
              </div>
              <div className="ml-2">
                <p className="font-medium">Confirmación</p>
              </div>
            </div>
          </div>

          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Detalles de la cita</CardTitle>
                <CardDescription>
                  Selecciona el servicio, profesional, fecha y hora
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form className="space-y-6">
                    <FormField
                      control={form.control}
                      name="service"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-white">Servicio</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                // Si selecciona un servicio, resetear promoción
                                if (value) form.setValue('promotion', '');
                              }}
                              value={field.value}
                              disabled={isLoadingServices}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un servicio" />
                              </SelectTrigger>
                              <SelectContent>
                                {isLoadingServices ? (
                                  <SelectItem value="loading" disabled>
                                    Cargando servicios...
                                  </SelectItem>
                                ) : services.length === 0 ? (
                                  <SelectItem value="no-services" disabled>
                                    No hay servicios disponibles
                                  </SelectItem>
                                ) : (
                                  services.map((service) => (
                                    <SelectItem
                                      key={service.id}
                                      value={service.id.toString()}
                                    >
                                      {service.title} - ${service.price} MXN
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Promociones */}
                    <FormField
                      control={form.control}
                      name="promotion"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-white">
                            Promoción
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                // Si selecciona una promoción, resetear servicio
                                if (value) form.setValue('service', '');
                              }}
                              value={field.value}
                              disabled={isLoadingPromotions}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona una promoción" />
                              </SelectTrigger>
                              <SelectContent>
                                {isLoadingPromotions ? (
                                  <SelectItem value="loading" disabled>
                                    Cargando promociones...
                                  </SelectItem>
                                ) : promotions.length === 0 ? (
                                  <SelectItem value="no-promotions" disabled>
                                    No hay promociones disponibles
                                  </SelectItem>
                                ) : (
                                  promotions.map((promotion) => (
                                    <SelectItem
                                      key={promotion.id}
                                      value={promotion.id.toString()}
                                    >
                                      {promotion.title} - ${' '}
                                      {promotion.discount_price ||
                                        promotion.price}{' '}
                                      MXN
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-3">
                            <FormLabel>Fecha</FormLabel>
                            <div className="grid grid-cols-1 gap-3">
                              <Select
                                onValueChange={(value) => {
                                  const nextMonth =
                                    monthOptions.find((m) => m.key === value)
                                      ?.date ?? null;
                                  setSelectedMonth(nextMonth);
                                  setSelectedWeekStart(null);
                                  form.resetField('date');
                                  form.resetField('time');
                                  setAvailableTimeSlots([]);
                                }}
                                value={
                                  selectedMonth
                                    ? format(selectedMonth, 'yyyy-MM')
                                    : ''
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Elige un mes" />
                                </SelectTrigger>
                                <SelectContent>
                                  {monthOptions.map((month) => (
                                    <SelectItem
                                      key={month.key}
                                      value={month.key}
                                    >
                                      {month.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              <Select
                                onValueChange={(value) => {
                                  const nextWeekStart =
                                    weekOptions.find((w) => w.key === value)
                                      ?.start ?? null;
                                  setSelectedWeekStart(nextWeekStart);
                                  form.resetField('date');
                                  form.resetField('time');
                                  setAvailableTimeSlots([]);
                                }}
                                value={
                                  selectedWeekStart
                                    ? format(selectedWeekStart, 'yyyy-MM-dd')
                                    : ''
                                }
                                disabled={!selectedMonth}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Elige una semana" />
                                </SelectTrigger>
                                <SelectContent>
                                  {weekOptions.map((week) => (
                                    <SelectItem key={week.key} value={week.key}>
                                      {week.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              <div className="grid grid-cols-7 gap-2">
                                {dayOptions.map(({ day, disabled }) => {
                                  const isSelected =
                                    field.value &&
                                    format(field.value, 'yyyy-MM-dd') ===
                                      format(day, 'yyyy-MM-dd');

                                  return (
                                    <Button
                                      key={format(day, 'yyyy-MM-dd')}
                                      type="button"
                                      variant={
                                        isSelected ? 'default' : 'outline'
                                      }
                                      className="px-0"
                                      disabled={disabled}
                                      onClick={() => {
                                        field.onChange(day);
                                        form.resetField('time');
                                      }}
                                    >
                                      <span className="flex flex-col leading-none">
                                        <span className="text-[10px] uppercase opacity-80">
                                          {format(day, 'EEE', { locale: es })}
                                        </span>
                                        <span className="text-sm font-semibold">
                                          {format(day, 'd')}
                                        </span>
                                      </span>
                                    </Button>
                                  );
                                })}
                              </div>

                              <div className="text-sm text-muted-foreground">
                                {field.value
                                  ? format(field.value, 'PPP', { locale: es })
                                  : 'Selecciona mes, semana y día'}
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hora</FormLabel>
                            {!watchDate ? (
                              <div className="text-sm text-muted-foreground">
                                Selecciona un día para ver horarios disponibles.
                              </div>
                            ) : isLoadingTimeSlots ? (
                              <div className="text-sm text-muted-foreground">
                                Cargando horarios disponibles...
                              </div>
                            ) : availableTimeSlots.length === 0 ? (
                              <div className="text-sm text-muted-foreground">
                                No hay horarios disponibles para esta fecha. Por
                                favor selecciona otra fecha.
                              </div>
                            ) : (
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {availableTimeSlots.map((time) => {
                                  const isSelected = field.value === time;
                                  return (
                                    <Button
                                      key={time}
                                      type="button"
                                      variant={
                                        isSelected ? 'default' : 'outline'
                                      }
                                      onClick={() => field.onChange(time)}
                                    >
                                      {time}
                                    </Button>
                                  );
                                })}
                              </div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Tu nombre" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Correo electrónico</FormLabel>
                            <FormControl>
                              <Input placeholder="tu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teléfono</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Tu número de teléfono"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notas adicionales (opcional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Cualquier información adicional que debamos saber"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleContinueToStep2}>
                  Continuar
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Método de pago</CardTitle>
                <CardDescription>
                  Selecciona cómo deseas pagar tu cita
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">
                            {services.find((s) => s.id === watchService)?.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {form.getValues("date") &&
                              format(form.getValues("date"), "PPP", {
                                locale: es,
                              })}{" "}
                            a las {form.getValues("time")}
                          </p>
                        </div>
                        <p className="font-bold">
                          ${getServicePrice(watchService)}
                        </p>
                      </div>

                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Método de pago</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="card" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Tarjeta de crédito/débito
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="cash" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Efectivo (pago en el local)
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {watchPaymentMethod === "card" && (
                        <div className="space-y-4 p-4 border rounded-lg">
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <FormLabel htmlFor="cardNumber">
                                Número de tarjeta
                              </FormLabel>
                              <Input
                                id="cardNumber"
                                placeholder="1234 5678 9012 3456"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <FormLabel htmlFor="expiry">
                                  Fecha de expiración
                                </FormLabel>
                                <Input id="expiry" placeholder="MM/AA" />
                              </div>
                              <div>
                                <FormLabel htmlFor="cvc">CVC</FormLabel>
                                <Input id="cvc" placeholder="123" />
                              </div>
                            </div>
                            <div>
                              <FormLabel htmlFor="nameOnCard">
                                Nombre en la tarjeta
                              </FormLabel>
                              <Input
                                id="nameOnCard"
                                placeholder="Nombre como aparece en la tarjeta"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between pt-4 border-t">
                      <p className="font-medium">Total a pagar:</p>
                      <p className="font-bold text-xl">
                        ${getServicePrice(watchService)}
                      </p>
                    </div>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Regresar
                </Button>
                <Button
                  onClick={async () => {
                    const isValid = await form.trigger("paymentMethod");
                    if (isValid) {
                      form.handleSubmit(onSubmit)();
                    } else {
                      toast({
                        title: "Por favor selecciona un método de pago",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  Confirmar cita
                </Button>
              </CardFooter>
            </Card>
          )} */}

          {step === 2 && (
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                  <CheckCircle className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl">¡Cita confirmada!</CardTitle>
                <CardDescription>
                  Gracias por agendar tu cita con nosotros
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="font-medium">
                      {
                        services.find((s) => s.id === form.getValues('service'))
                          ?.name
                      }
                    </p>
                    <p className="text-muted-foreground">
                      {form.getValues('date') &&
                        format(form.getValues('date'), 'PPP', {
                          locale: es,
                        })}{' '}
                      a las {form.getValues('time')}
                    </p>
                    <p className="text-muted-foreground">
                      {/* Con:{" "}
                      {
                        stylists.find((s) => s.id === form.getValues("stylist"))
                          ?.name
                      } */}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      Hemos enviado un correo de confirmación a{' '}
                      {form.getValues('email')} con los detalles de tu cita.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Te recordaremos tu cita un día antes por correo
                      electrónico y mensaje de texto.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <Button
                  onClick={() => {
                    form.reset();
                    setStep(1);
                  }}
                >
                  Agendar otra cita
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
