import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import type { Appointment } from "@/interfaces/appointments/Appointment";

type CreateAppointmentData = Omit<Appointment, "id" | "created_at" | "user_id">;

export const createAppointment = async (
  data: CreateAppointmentData,
): Promise<Appointment | undefined> => {
  const supabase = await createClient();
  const userId = await getUserId();

  if (!userId) {
    console.error("User ID not found, cannot create appointment.");
    return undefined;
  }

  const appointmentData = {
    ...data,
    user_id: userId,
  };

  const { data: newAppointment, error } = await supabase
    .from("appointments")
    .insert([appointmentData])
    .select("*")
    .single();

  if (error) {
    console.error("Error creating appointment:", error.message);
    return undefined;
  }

  return newAppointment as Appointment;
};
