import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";

export const deleteNonWorkingDay = async (id: number): Promise<boolean> => {
  const supabase = await createClient();
  const userId = await getUserId();

  if (!userId) {
    console.error("User ID not found, cannot delete non-working day.");
    return false;
  }

  const { error } = await supabase
    .from("non_working_days")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting non-working day:", error.message);
    return false;
  }

  return true;
};
