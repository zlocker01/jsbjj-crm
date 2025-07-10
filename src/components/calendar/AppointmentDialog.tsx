"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AppointmentForm } from "./AppointmentForm";
import type { Appointment } from "@/interfaces/appointments/Appointment";
import type { Client } from "@/interfaces/client/Client";
import type { Service } from "@/interfaces/services/Service";
import type { Promotion } from "@/interfaces/promotions/Promotion";

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: any) => Promise<void>;
  appointment?: Appointment | null;
  clients: Client[];
  services: Service[];
  promotions: Promotion[];
}

export function AppointmentDialog({
  open,
  onOpenChange,
  onSubmit,
  appointment,
  clients,
  services,
  promotions,
}: AppointmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {appointment ? "Editar Cita" : "Nueva Cita"}
          </DialogTitle>
          <DialogDescription>
            {appointment
              ? "Modifica los datos de la cita"
              : "Completa los datos para crear una nueva cita"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <AppointmentForm
            appointment={appointment || undefined}
            clients={clients}
            services={services}
            promotions={promotions}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
