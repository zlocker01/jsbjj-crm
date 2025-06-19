import { createClient } from "@/utils/supabase/server";

export const deleteEmployee = async (employeeId: string): Promise<boolean> => {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("employees")
      .delete()
      .eq("id", employeeId);

    if (error) {
      console.error("Error deleting employee:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Unexpected error:", error);
    return false;
  }
};
