import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import type { Schedule } from "@/interfaces/schedule/Schedule";

export const getSchedules = async (): Promise<Schedule[] | undefined> => {
  const supabase = await createClient();
  const userId = await getUserId();

  if (!userId) {
    console.error("User ID not found, cannot fetch working hours.");
    return undefined;
  }

  const { data, error } = await supabase.from("working_hours").select("*");

  if (error) {
    console.error("🚀 ~ getWorkingHours error:", error.message);
    return undefined;
  }

  return data as Schedule[];
};
