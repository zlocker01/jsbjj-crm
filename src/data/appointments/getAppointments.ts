import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import type { Appointment } from "@/interfaces/appointments/Appointment";

export const getAppointments = async (): Promise<Appointment[] | undefined> => {
  const supabase = await createClient();
  const userId = await getUserId();

  if (!userId) {
    console.error("User ID not found, cannot fetch appointments.");
    return undefined;
  }

  const { data, error } = await supabase.from("appointments").select("*");

  if (error) {
    console.error("Error fetching appointments:", error.message);
    return undefined;
  }

  return data as Appointment[];
};
