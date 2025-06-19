import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import type { NonWorkingDay } from "@/interfaces/schedule/NonWorkingDays";
import type { CreateNonWorkingDayData } from "./nonWorkingDayTypes";

export const createNonWorkingDay = async (
  dayData: CreateNonWorkingDayData,
): Promise<NonWorkingDay | null> => {
  const supabase = await createClient();
  const userId = await getUserId();

  if (!userId) {
    console.error("User ID not found, cannot create non-working day.");
    return null;
  }

  const { data, error } = await supabase
    .from("non_working_days")
    .insert([
      {
        ...dayData,
        user_id: userId,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating non-working day:", error.message);
    return null;
  }

  return data as NonWorkingDay;
};
