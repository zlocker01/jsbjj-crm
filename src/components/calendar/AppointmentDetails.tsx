"use client";

import { Button } from "@/components/ui/button";
import { Calendar, User, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import type { Appointment } from "@/interfaces/appointments/Appointment";

interface AppointmentDetailsProps {
  appointment: Appointment | null;
  onEdit: (appointment: Appointment) => void;
  onCreateNew: () => void;
  onClose: () => void;
}

export function AppointmentDetails({
  appointment,
  onEdit,
  onCreateNew,
  onClose,
}: AppointmentDetailsProps) {
  const { toast } = useToast();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  if (!appointment) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
        <Calendar className="h-12 w-12 mb-4 opacity-20" />
        <p>Selecciona una cita para ver sus detalles</p>
      </div>
    );
  }

  const handleCancelAppointment = async () => {
    try {
      // Lógica para cancelar la cita
      const response = await fetch(`/api/appointments/${appointment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Cancelada" }),
      });

      if (!response.ok) {
        throw new Error("Error al cancelar la cita");
      }

      // Cerrar el diálogo de confirmación
      setShowCancelDialog(false);

      // Cerrar los detalles
      onClose();

      // Mostrar notificación
      toast({
        title: "Cita cancelada",
        description: "La cita ha sido cancelada correctamente.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error al cancelar la cita:", error);
      toast({
        title: "Error",
        description:
          "No se pudo cancelar la cita. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">Detalles de la Cita</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">
              {appointment?.client_id || "Sin cliente"}
            </p>
            <p className="text-sm text-muted-foreground">
              {appointment?.client_id || "Sin correo"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">
              {format(
                new Date(appointment?.start_datetime),
                "EEEE d 'de' MMMM",
                { locale: es },
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(appointment.start_datetime), "HH:mm")} -{" "}
              {format(new Date(appointment.end_datetime), "HH:mm")}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Servicio</p>
          <p>{appointment.service_id || "Sin servicio"}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Estado</p>
          <Badge
            variant={
              appointment.status === "Confirmada"
                ? "default"
                : appointment.status === "Cancelada"
                  ? "destructive"
                  : "outline"
            }
          >
            {appointment.status === "Confirmada"
              ? "Confirmada"
              : appointment.status === "Cancelada"
                ? "Cancelada"
                : "Confirmada"}
          </Badge>
        </div>

        {appointment.notes && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Notas</p>
            <p className="text-sm text-muted-foreground">{appointment.notes}</p>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCancelDialog(true)}
          disabled={appointment.status === "Cancelada"}
        >
          Cancelar cita
        </Button>
        <Button size="sm" onClick={() => onEdit(appointment)}>
          Editar
        </Button>
      </div>

      {/* Diálogo de confirmación de cancelación */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Cancelar cita?</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="p-3 bg-muted rounded-lg space-y-2">
              <div className="font-medium">{appointment.client_id}</div>
              <div className="text-sm">{appointment.service_id}</div>
              <div className="text-sm text-muted-foreground">
                {format(
                  new Date(appointment.start_datetime),
                  "EEEE d 'de' MMMM",
                  { locale: es },
                )}{" "}
                • {format(new Date(appointment.start_datetime), "HH:mm")} -{" "}
                {format(new Date(appointment.end_datetime), "HH:mm")}
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Esta acción no se puede deshacer. La cita será marcada como
              cancelada y se liberará el horario.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              Volver
            </Button>
            <Button variant="destructive" onClick={handleCancelAppointment}>
              Sí, cancelar cita
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
