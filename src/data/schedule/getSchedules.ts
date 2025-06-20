import { createClient } from "@/utils/supabase/server";
import type { Schedule } from "@/interfaces/schedule/Schedule";

export const getSchedules = async (): Promise<Schedule[] | undefined> => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("working_hours").select("*");

  if (error) {
    console.error("🚀 ~ getSchedules error:", error.message);
    return undefined;
  }

  return data as Schedule[];
};
