"use client";

import React, { useEffect, useState } from "react";
import {
  addDays,
  addMonths,
  format,
  getDay,
  getDaysInMonth,
  startOfMonth,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useToast } from "@/components/ui/use-toast";
import type { Appointment } from "@/interfaces/appointments/Appointment";

interface AppointmentCalendarProps {
  view: "month" | "week" | "day";
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  onDateChange?: (date: Date) => void;
  onAppointmentSelect?: (appointment: Appointment) => void;
  onViewChange?: (view: "month" | "week" | "day") => void;
}

export function AppointmentCalendar({
  view,
  appointments,
  onDateChange = () => {},
  onAppointmentSelect = () => {},
}: AppointmentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { toast } = useToast();

  useEffect(() => {
    if (view === "month") {
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
    } else if (view === "week") {
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
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(addDays(currentDate, -7));
    } else {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const handleNext = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === "week") {
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
        format(new Date(appointment.start_datetime), "yyyy-MM-dd") ===
          format(date, "yyyy-MM-dd"),
    );
  };

  const handleAppointmentClick = (
    appointment: Appointment,
    e: React.MouseEvent | React.KeyboardEvent,
  ) => {
    e.stopPropagation();
    onAppointmentSelect(appointment);

    toast({
      title: "Cita seleccionada",
      description: `${appointment.date} a las ${appointment.start_datetime}`,
      duration: 4000,
      variant: "gold",
    });
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <Button variant="ghost" size="icon" onClick={handlePrevious}>
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <h2 className="text-lg font-semibold">
        {format(currentDate, "MMMM yyyy", { locale: es })}
      </h2>
      <Button variant="ghost" size="icon" onClick={handleNext}>
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );

  const renderMonthView = () => (
    <div className="overflow-x-auto">
      <div className="min-w-[640px]">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
            <div key={day} className="text-center font-medium py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday =
              format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
            const dayAppointments = getAppointmentsForDate(day);
            const dayKey = format(day, "yyyy-MM-dd");

            return (
              <button
                key={dayKey}
                type="button"
                className={`min-h-[100px] border rounded-md p-1 text-left ${
                  isCurrentMonth ? "bg-background" : "bg-muted/30"
                } ${isToday ? "border-primary" : ""} cursor-pointer hover:bg-muted/50 transition-colors`}
                onClick={() => onDateChange(day)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onDateChange(day);
                  }
                }}
                aria-label={`${format(day, "EEEE, d 'de' MMMM", { locale: es })}, ${dayAppointments.length} citas`}
              >
                <div className="text-right mb-1">
                  <span
                    className={`inline-block rounded-full w-6 h-6 text-center ${
                      isToday ? "bg-primary text-primary-foreground" : ""
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                </div>
                <div className="space-y-1">
                  {dayAppointments.slice(0, 3).map((appointment) => (
                    <button
                      key={appointment.id}
                      type="button"
                      className={`text-xs p-1 rounded truncate w-full text-left ${
                        appointment.status === "Confirmada"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : appointment.status === "Cancelada"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      } hover:opacity-80`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAppointmentClick(appointment, e);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAppointmentClick(appointment, e);
                        }
                      }}
                      aria-label={`Cita a las ${format(appointment.start_datetime, "HH:mm")}, estado: ${appointment.status}`}
                    >
                      {format(appointment.start_datetime, "HH:mm")}
                    </button>
                  ))}
                  {dayAppointments.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{dayAppointments.length - 3} más
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {renderHeader()}
      {view === "month" && renderMonthView()}
      {/* Puedes agregar renderWeekView y renderDayView si lo necesitas */}
    </div>
  );
}
