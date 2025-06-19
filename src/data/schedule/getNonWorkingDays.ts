import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import type { NonWorkingDay } from "@/interfaces/schedule/NonWorkingDays";

export const getNonWorkingDays = async (): Promise<NonWorkingDay[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("non_working_days")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching non-working days:", error.message);
    return [];
  }

  return data as NonWorkingDay[];
};
