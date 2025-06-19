import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import type { Schedule } from "@/interfaces/schedule/Schedule";

export type UpdateScheduleData = Partial<Omit<Schedule, "id" | "user_id">>; //Esto significa que puedes enviar solo los campos que deseas actualizar, y los campos id y user_id no se incluyen en los datos de actualización (ya que id se usa para identificar el registro y user_id para la autorización).

export const updateSchedule = async (
  id: bigint,
  scheduleData: UpdateScheduleData,
): Promise<Schedule | undefined> => {
  const supabase = await createClient();
  const userId = await getUserId();

  if (!userId) {
    console.error("User ID not found, cannot update working hours.");
    return undefined;
  }

  const { data, error } = await supabase
    .from("working_hours")
    .update(scheduleData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("🚀 ~ updateWorkingHours error:", error.message);
    return undefined;
  }

  return data as Schedule;
};
