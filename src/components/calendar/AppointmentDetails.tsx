'use client';

import { Button } from '@/components/ui/button';
import { Calendar, User, X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import type { Appointment } from '@/interfaces/appointments/Appointment';
import { Client } from '@/interfaces/client/Client';
import { Promotion } from '@/interfaces/promotions/Promotion';
import { Service } from '@/interfaces/services/Service';

interface AppointmentDetailsProps {
  appointment: Appointment | null;
  clients: Client[];
  services: Service[];
  promotions: Promotion[];
  onEdit: (appointment: Appointment) => void;
  onCreateNew: () => void;
  onClose: () => void;
  onAppointmentCancelled?: () => void;
}

export function AppointmentDetails({
  appointment,
  clients,
  services,
  promotions,
  onEdit,
  onCreateNew,
  onClose,
  onAppointmentCancelled,
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
      const response = await fetch(`/api/appointments/${appointment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Cancelada' }),
      });

      if (!response.ok) {
        throw new Error('Error al cancelar la cita');
      }

      setShowCancelDialog(false);
      onClose();
      if (onAppointmentCancelled) {
        onAppointmentCancelled();
      }
      toast({
        title: 'Cita cancelada',
        description: 'La cita ha sido cancelada correctamente.',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error al cancelar la cita:', error);
      toast({
        title: 'Error',
        description:
          'No se pudo cancelar la cita. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
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
              {
                clients.find((client) => client.id === appointment?.client_id)
                  ?.name
              }
            </p>
            <p className="text-sm text-muted-foreground">
              {
                clients.find((client) => client.id === appointment?.client_id)
                  ?.email
              }
            </p>
            <p className="text-sm text-muted-foreground">
              {
                clients.find((client) => client.id === appointment?.client_id)
                  ?.phone
              }
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
                { locale: es }
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(appointment.start_datetime), 'HH:mm')} -{' '}
              {format(new Date(appointment.end_datetime), 'HH:mm')}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Servicio o Promoción</p>
          {appointment.promotion_id
            ? (() => {
                const promo = promotions.find(
                  (p) => p.id === appointment.promotion_id
                );
                return promo ? (
                  <>
                    <p>{promo.title}</p>
                    <p>
                      Precio:{' '}
                      <span className="line-through">${promo.price}</span>{' '}
                      <span className="font-bold">${promo.discount_price}</span>
                    </p>
                    <p>Duración aproximada: {promo.duration_minutes} minutos</p>
                    <p className="text-xs text-muted-foreground">
                      {promo.description}
                    </p>
                  </>
                ) : (
                  <p>Sin promoción</p>
                );
              })()
            : (() => {
                const service = services.find(
                  (s) => s.id === appointment.service_id
                );
                return service ? (
                  <>
                    <p>{service.title}</p>
                    <p>Precio: ${service.price}</p>
                    <p>
                      Duración aproximada: {service.duration_minutes || 0}{' '}
                      minutos
                    </p>
                  </>
                ) : (
                  <p>Sin servicio</p>
                );
              })()}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Estado</p>
          <Badge
            variant={
              appointment.status === 'Confirmada'
                ? 'confirmada'
                : appointment.status === 'Cancelada'
                ? 'cancelada'
                : 'proceso'
            }
          >
            {appointment.status === 'Confirmada'
              ? 'Confirmada'
              : appointment.status === 'Cancelada'
              ? 'Cancelada'
              : 'Confirmada'}
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
          variant="destructive"
          size="sm"
          onClick={() => setShowCancelDialog(true)}
          disabled={appointment.status === 'Cancelada'}
        >
          Cancelar cita
        </Button>
        {/* <Button size="sm" onClick={() => onEdit(appointment)}>
          Editar
        </Button> */}
      </div>

      {/* Diálogo de confirmación de cancelación */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Cancelar cita?</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="p-3 bg-muted rounded-lg space-y-2">
              <div className="font-medium">
                {
                  clients.find((client) => client.id === appointment?.client_id)
                    ?.name
                }
              </div>
              <div className="text-sm">
                Servicio:{' '}
                {
                  services.find(
                    (service) => service.id === appointment?.service_id
                  )?.title
                }
              </div>
              <div className="text-sm text-muted-foreground">
                {format(
                  new Date(appointment.start_datetime),
                  "EEEE d 'de' MMMM",
                  { locale: es }
                )}{' '}
                • {format(new Date(appointment.start_datetime), 'HH:mm')} -{' '}
                {format(new Date(appointment.end_datetime), 'HH:mm')}
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Esta acción no se puede deshacer. La cita será marcada como
              cancelada y se liberará el horario.
            </p>
          </div>

          <DialogFooter className="flex justify-between gap-3 md:gap-0">
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
