import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/date-utils";
import type { Appointment } from "@/interfaces/appointments/Appointment";
import type { Client } from "@/interfaces/client/Client";
import type { Service } from "@/interfaces/services/Service";

interface RecentAppointment extends Omit<Appointment, 'client_id' | 'service_id'> {
  client: Pick<Client, 'id' | 'name' | 'avatar'>;
  service: Pick<Service, 'id' | 'title'>;
}

const recentAppointments: RecentAppointment[] = [
];

interface RecentAppointmentsProps {
  appointments?: RecentAppointment[];
}

export function RecentAppointments({ appointments = recentAppointments }: RecentAppointmentsProps) {
  if (!appointments || appointments.length === 0) {
    return <p className="text-sm text-muted-foreground">No hay citas recientes.</p>;
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="flex items-center gap-4 p-3 bg-card border rounded-lg hover:shadow-md transition-shadow">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={appointment.client.avatar}
              alt={appointment.client.name}
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {appointment.client.name?.substring(0, 2).toUpperCase() || "CL"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none">
                {appointment.client.name}
              </p>
              <Badge
                variant={
                  appointment.status === "Confirmada"
                    ? "confirmada"
                    : appointment.status === "Proceso"
                      ? "proceso"
                      : "cancelada"
                }
                className="text-xs"
              >
                {
                  appointment.status === "Confirmada"
                    ? "Confirmada"
                    : appointment.status === "Proceso"
                      ? "En Proceso"
                      : "Cancelada"
                }
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {appointment.service.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDateTime(appointment.start_datetime, "PPP p")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
