"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SearchableSelect } from "./form-fields/SearchableSelect";
import { User, Scissors, Tag, Loader2 } from "lucide-react";

import {
  appointmentSchema,
  type AppointmentFormValues,
} from "@/schemas/appointmentSchemas/appointmentSchema";
import type { Appointment } from "@/interfaces/appointments/Appointment";
import type { Client } from "@/interfaces/client/Client";
import type { Service } from "@/interfaces/services/Service";
import type { Promotion } from "@/interfaces/promotions/Promotion";
import { DateTimeSelector } from "./form-fields/TimeSelector";

interface AppointmentFormProps {
  appointment?: Appointment;
  clients: Client[];
  services: Service[];
  promotions: Promotion[];
  onSubmit: (data: AppointmentFormValues) => Promise<void>;
  onCancel: (appointment: Appointment | null) => void;
}

export function AppointmentForm({
  appointment,
  clients,
  services,
  promotions,
  onSubmit,
  onCancel,
}: AppointmentFormProps) {
  const { toast } = useToast();

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      client_id: appointment?.client_id || "",
      service_id: appointment?.service_id ?? null,
      promotion_id: appointment?.promotion_id ?? null,
      start_datetime: appointment?.start_datetime || "",
      status: "Confirmada",
      notes: appointment?.notes || "",
    },
    mode: "onChange",
    criteriaMode: "all",
  });

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Cliente */}
          <SearchableSelect
            control={form.control}
            name="client_id"
            label="Cliente"
            placeholder="Selecciona un cliente"
            notFoundMessage="Cliente no encontrado."
            options={clients.map((client) => ({
              value: client.id,
              label: client.name,
            }))}
            icon={<User className="mr-2 h-4 w-4 opacity-50" />}
          />

          {/* Servicio */}
          <SearchableSelect
            control={form.control}
            name="service_id"
            label="Servicio"
            placeholder="Selecciona un servicio"
            notFoundMessage="Servicio no encontrado."
            options={services.map((service) => ({
              value: service.id.toString(),
              label: `${service.title} - ${service.duration_minutes} min`,
            }))}
            icon={<Scissors className="mr-2 h-4 w-4 opacity-50" />}
            onValueChange={(value, onChange) => {
              onChange(value ? Number(value) : null);
            }}
          />
        </div>

        {/* Promoción */}
        <SearchableSelect
          control={form.control}
          name="promotion_id"
          label="Promoción"
          placeholder="Selecciona una promoción"
          notFoundMessage="Promoción no encontrada."
          options={[
            { value: "no-promo", label: "Sin promoción" },
            ...promotions.map((promo) => ({
              value: promo.id.toString(),
              label: `${promo.title} - ${promo.duration_minutes} min`,
            })),
          ]}
          icon={<Tag className="mr-2 h-4 w-4 opacity-50" />}
          onValueChange={(value, onChange) => {
            onChange(value === "no-promo" ? null : Number(value));
          }}
        />

        {/* fecha */}
        <DateTimeSelector control={form.control} disabled={isSubmitting} />

        {/* Notas */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <Textarea
                placeholder="Notas adicionales sobre la cita"
                className="min-h-[100px]"
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botones */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onCancel(appointment || null)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : appointment ? (
              "Actualizar cita"
            ) : (
              "Crear cita"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
