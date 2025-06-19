import { useState } from "react";
import { AppointmentFormValues } from "@/schemas/appointmentSchemas/appointmentSchema";
import { useToast } from "@/components/ui/use-toast";

export function useCreateAppointment() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function createAppointment(data: AppointmentFormValues) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear la cita");
      }

      const result = await response.json();

      toast({
        title: "Cita creada",
        description: "Tu cita fue creada con éxito.",
        variant: "success",
      });

      return result;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error inesperado",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  return { createAppointment, isLoading };
}
