"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { useParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useCalendarData } from "@/hooks/calendar/useCalendarData";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AppointmentCalendar } from "@/components/calendar/AppointmentCalendar";
import { AppointmentDetails } from "@/components/calendar/AppointmentDetails";
import { AppointmentDialog } from "@/components/calendar/AppointmentDialog";

import type { Appointment } from "@/interfaces/appointments/Appointment";
import { NewClientDialog } from "@/components/clients/NewClientDialog";
import type { ClientFormValues } from "@/schemas/clientSchemas/clientSchema";

export default function CalendarPage() {
  const params = useParams();
  const { toast } = useToast();
  const landingId = params.landingId as string;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [view, setView] = useState('month');
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);

  // Nueva función para manejar la selección de cita
  const handleAppointmentSelect = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleDateChange = (date: Date) => {
    console.log(date);
  };

  const {
    appointments = [],
    clients = [],
    services = [],
    promotions = [],
    isLoading,
    error,
    mutate,
  } = useCalendarData(landingId);

  const handleCreateClient = async (data: ClientFormValues) => {
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast({
        title: "Paciente creado",
        description: `El paciente ${data.name} ha sido creado correctamente.`,
        variant: "success",
      });
      setIsNewClientDialogOpen(false);
      mutate(); // Recargar todos los datos del calendario, incluyendo los pacientes
    } else {
      toast({
        title: "Error",
        description: "No se pudo crear el paciente.",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      // Hacer la petición a la API para guardar la cita
      const response = await fetch(`/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Error al guardar la cita");
      }

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Cita guardada",
          description: "La cita se ha guardado correctamente.",
          variant: "success",
        });
        setIsFormOpen(false);

        // Recargar los datos para mostrar la nueva cita
        mutate();
      } else {
        throw new Error(result.error || "Error desconocido al guardar la cita");
      }
    } catch (error) {
      console.error("Error saving appointment:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? `No se pudo guardar la cita: ${error.message}`
            : "No se pudo guardar la cita. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Cargando...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        Error al cargar los datos: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Encabezado y botón */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Calendario de Citas
          </h1>
          <p className="text-muted-foreground">
            Administra tus citas en tiempo real desde aquí
          </p>
          <p className="text-goldAccent font-bold">
            {format(new Date(), "EEEE d 'de' MMMM 'de' yyyy, hh:mm a", {
              locale: es,
            })}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto self-end md:self-auto">
          <Button
            onClick={() => setIsNewClientDialogOpen(true)}
            variant="outline"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Paciente
          </Button>
          <Button
            onClick={() => {
              setSelectedAppointment(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nueva Cita
          </Button>
        </div>
      </div>

      {/* Grid responsive */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-10 gap-4">
        <div className="col-span-1 lg:col-span-7">
          <AppointmentCalendar
            view={view as "month" | "week" | "day"}
            onViewChange={setView}
            appointments={appointments}
            isLoading={isLoading}
            error={error}
            onDateChange={handleDateChange}
            onAppointmentSelect={handleAppointmentSelect}
          />
        </div>
        <div className="col-span-1 lg:col-span-3">
          <AppointmentDetails
            appointment={selectedAppointment}
            clients={clients}
            services={services}
            promotions={promotions}
            onEdit={() => {
              if (selectedAppointment) {
                setIsFormOpen(true);
              }
            }}
            onClose={() => setSelectedAppointment(null)}
            onCreateNew={() => {
              setSelectedAppointment(null);
              setIsFormOpen(true);
            }}
          />
        </div>
      </div>

      {/* Formulario en modal */}
      <AppointmentDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        appointment={selectedAppointment}
        clients={clients}
        services={services}
        promotions={promotions}
      />

      {/* Diálogo para crear nuevo cliente */}
      <NewClientDialog
        open={isNewClientDialogOpen}
        onOpenChange={setIsNewClientDialogOpen}
        onSubmit={handleCreateClient}
      />
    </div>
  );
}
