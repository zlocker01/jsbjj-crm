'use client';

import React, { useEffect, useState } from 'react';
import {
  addDays,
  addMonths,
  format,
  getDay,
  getDaysInMonth,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useToast } from '@/components/ui/use-toast';
import type { Appointment } from '@/interfaces/appointments/Appointment';

interface AppointmentCalendarProps {
  view: 'month' | 'week' | 'day';
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  onDateChange?: (date: Date) => void;
  onAppointmentSelect?: (appointment: Appointment) => void;
  onViewChange?: (view: 'month' | 'week' | 'day') => void;
}

export function AppointmentCalendar({
  view,
  appointments,
  onViewChange,
  onDateChange = () => {},
  onAppointmentSelect = () => {},
}: AppointmentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  const isMobile = useMediaQuery('(max-width: 640px)');
  const { toast } = useToast();

  useEffect(() => {
    if (view === 'month') {
      const days: Date[] = [];
      const firstDay = startOfMonth(currentDate);
      const daysInMonth = getDaysInMonth(currentDate);
      const startDay = getDay(firstDay);

      for (let i = startDay; i > 0; i--) {
        days.push(addDays(firstDay, -i));
      }

      for (let i = 0; i < daysInMonth; i++) {
        days.push(addDays(firstDay, i));
      }

      const remainingDays = 7 - (days.length % 7);
      if (remainingDays < 7) {
        for (let i = 1; i <= remainingDays; i++) {
          days.push(addDays(firstDay, daysInMonth - 1 + i));
        }
      }

      setCalendarDays(days);
    } else if (view === 'week') {
      const days: Date[] = [];
      const dayOfWeek = getDay(currentDate);
      const firstDayOfWeek = addDays(currentDate, -dayOfWeek);

      for (let i = 0; i < 7; i++) {
        days.push(addDays(firstDayOfWeek, i));
      }

      setCalendarDays(days);
    } else {
      setCalendarDays([currentDate]);
    }
  }, [currentDate, view]);

  const handlePrevious = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(addDays(currentDate, -7));
    } else {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const getAppointmentsForDate = (date: Date) => {
    if (!Array.isArray(appointments)) {
      return [];
    }
    return appointments.filter(
      (appointment) =>
        appointment?.start_datetime &&
        format(new Date(appointment.start_datetime), 'yyyy-MM-dd') ===
          format(date, 'yyyy-MM-dd')
    );
  };

  const handleAppointmentClick = (
    appointment: Appointment,
    e: React.MouseEvent | React.KeyboardEvent
  ) => {
    e.stopPropagation();
    onAppointmentSelect(appointment);

    const startDate = new Date(appointment.start_datetime);
    const endDate = new Date(appointment.end_datetime);

    toast({
      title: 'Cita seleccionada',
      description: (
        <div className="space-y-1">
          <div>
            <span className="font-medium">Día: </span>
            <span>
              {format(startDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
            </span>
          </div>
          <div>
            <span className="font-medium">Hora: </span>
            <span>
              {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
            </span>
          </div>
        </div>
      ),
      duration: 4000,
      variant: 'success',
    });
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <Button variant="ghost" size="icon" onClick={handlePrevious}>
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <h2 className="text-lg font-semibold">
        {format(currentDate, 'MMMM yyyy', { locale: es })}
      </h2>
      <Button variant="ghost" size="icon" onClick={handleNext}>
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );

  const layoutAppointmentsForDay = (appointments: Appointment[]) => {
    const groupedByStartTime = appointments.reduce((acc, app) => {
      const startTime = new Date(app.start_datetime).getTime();
      if (!acc[startTime]) {
        acc[startTime] = [];
      }
      acc[startTime].push(app);
      return acc;
    }, {} as Record<number, Appointment[]>);

    return Object.values(groupedByStartTime).flatMap((group) => {
      const groupWidth = 100 / group.length;
      return group.map((app, index) => ({
        ...app,
        layout: {
          width: `${groupWidth}%`,
          left: `${groupWidth * index}%`,
        },
      }));
    });
  };

  const renderDayView = () => {
    const day = calendarDays[0];
    if (!day) return null;

    const dayAppointments = getAppointmentsForDate(day);
    const laidOutAppointments = layoutAppointmentsForDay(dayAppointments);
    const hours = Array.from({ length: 15 }, (_, i) => i + 6); // 6 AM to 8 PM

    return (
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-center mb-4">
          {format(day, "EEEE, d 'de' MMMM", { locale: es })}
        </h3>
        <div className="relative">
          {hours.map((hour) => (
            <div key={hour} className="flex items-center h-16 border-t">
              <div className="text-xs text-muted-foreground w-16 text-right pr-2">
                {format(new Date(0, 0, 0, hour), 'h a')}
              </div>
              <div className="flex-1" />
            </div>
          ))}
          {laidOutAppointments.map((appointment) => {
            const start = new Date(appointment.start_datetime);
            const top = (start.getHours() - 6 + start.getMinutes() / 60) * 64; // 64px per hour, base hour is now 6
            const appointmentWidth = parseFloat(appointment.layout.width);
            const appointmentLeft = parseFloat(appointment.layout.left);

            return (
              <button
                key={appointment.id}
                type="button"
                className={`absolute p-2 rounded-lg text-left text-sm z-10 border shadow-sm hover:shadow-md transition-all ${
                  appointment.status === 'Confirmada'
                    ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-100 dark:border-green-800'
                    : appointment.status === 'Cancelada'
                    ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-100 dark:border-red-800'
                    : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-100 dark:border-green-800'
                }`}
                style={{
                  top: `${top}px`,
                  height: '60px',
                  width: `calc((100% - 4rem) * ${appointmentWidth / 100})`,
                  left: `calc(4rem + (100% - 4rem) * ${appointmentLeft / 100})`,
                }}
                onClick={(e) => handleAppointmentClick(appointment, e)}
              >
                Cita {format(start, 'h:mm a')}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => (
    <div className="border rounded-lg overflow-hidden">
      <div className="grid grid-cols-7 divide-x">
        {calendarDays.map((day) => (
          <div
            key={format(day, 'yyyy-MM-dd')}
            className="flex flex-col items-center py-2"
          >
            <div className="font-medium text-sm">
              {format(day, 'E', { locale: es })}
            </div>
            <div
              className={`text-lg font-bold ${
                format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                  ? 'text-primary'
                  : ''
              }`}
            >
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 divide-x h-[600px] overflow-y-auto">
        {calendarDays.map((day) => {
          const dayAppointments = getAppointmentsForDate(day);
          const laidOutAppointments = layoutAppointmentsForDay(dayAppointments);
          return (
            <div key={format(day, 'yyyy-MM-dd')} className="relative border-t">
              {laidOutAppointments.map((appointment) => {
                const start = new Date(appointment.start_datetime);
                const top =
                  ((start.getHours() * 60 + start.getMinutes()) / (24 * 60)) *
                  100; // Position as percentage
                const appointmentWidth = parseFloat(appointment.layout.width);
                const appointmentLeft = parseFloat(appointment.layout.left);

                return (
                  <button
                    key={appointment.id}
                    type="button"
                    className={`absolute text-xs p-1 rounded truncate text-left border shadow-sm hover:shadow-md transition-all ${
                      appointment.status === 'Confirmada'
                        ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-100 dark:border-green-800'
                        : appointment.status === 'Cancelada'
                        ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-100 dark:border-red-800'
                        : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-100 dark:border-green-800'
                    }`}
                    style={{
                      top: `${top}%`,
                      width: `calc(${appointmentWidth}% - 2px)`,
                      left: `calc(${appointmentLeft}% + 1px)`,
                    }}
                    onClick={(e) => handleAppointmentClick(appointment, e)}
                  >
                    {format(start, 'HH:mm')}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderMonthView = () => (
    <div className="overflow-x-auto">
      <div className="min-w-[640px]">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
            <div key={day} className="text-center font-medium py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday =
              format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            const dayAppointments = getAppointmentsForDate(day);
            const dayKey = format(day, 'yyyy-MM-dd');

            return (
              <div
                key={dayKey}
                role="button"
                tabIndex={0}
                className={`min-h-[100px] border rounded-md p-1 text-left ${
                  isCurrentMonth ? 'bg-background' : 'bg-muted/30'
                } ${
                  isToday ? 'border-primary' : ''
                } cursor-pointer hover:bg-muted/50 transition-colors`}
                onClick={() => onDateChange(day)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onDateChange(day);
                  }
                }}
                aria-label={`${format(day, "EEEE, d 'de' MMMM", {
                  locale: es,
                })}, ${dayAppointments.length} citas`}
              >
                <div className="text-right mb-1">
                  <span
                    className={`inline-block rounded-full w-6 h-6 text-center ${
                      isToday ? 'bg-primary text-primary-foreground' : ''
                    }`}
                  >
                    {format(day, 'd')}
                  </span>
                </div>
                <div className="space-y-1">
                  {dayAppointments.slice(0, 3).map((appointment) => (
                    <button
                      key={appointment.id}
                      type="button"
                      className={`text-xs p-1 rounded truncate w-full text-left border shadow-sm hover:shadow-md transition-all ${
                        appointment.status === 'Confirmada'
                          ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-100 dark:border-green-800'
                          : appointment.status === 'Cancelada'
                          ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-100 dark:border-red-800'
                          : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-100 dark:border-green-800'
                      } hover:opacity-80`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAppointmentClick(appointment, e);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAppointmentClick(appointment, e);
                        }
                      }}
                      aria-label={`Cita a las ${format(
                        appointment.start_datetime,
                        'HH:mm'
                      )}, estado: ${appointment.status}`}
                    >
                      {format(appointment.start_datetime, 'HH:mm')}
                    </button>
                  ))}
                  {dayAppointments.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{dayAppointments.length - 3} más
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Button
          onClick={() => onViewChange && onViewChange('month')}
          variant={view === 'month' ? 'gold' : 'outline'}
        >
          Mes
        </Button>
        <Button
          onClick={() => onViewChange && onViewChange('week')}
          variant={view === 'week' ? 'gold' : 'outline'}
        >
          Semana
        </Button>
        <Button
          onClick={() => onViewChange && onViewChange('day')}
          variant={view === 'day' ? 'gold' : 'outline'}
        >
          Día
        </Button>
      </div>
      {renderHeader()}
      {view === 'month' && renderMonthView()}
      {view === 'week' && renderWeekView()}
      {view === 'day' && renderDayView()}
    </div>
  );
}
