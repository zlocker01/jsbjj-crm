import { createClient } from "@/utils/supabase/server";
import type { Employee } from "@/interfaces/employees/Employee";

export const updateEmployee = async (
  employeeId: string,
  updates: Partial<
    Omit<Employee, "id" | "user_id" | "landing_page_id" | "created_at">
  >,
): Promise<boolean> => {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("employees")
      .update({
        ...updates,
      })
      .eq("id", employeeId);

    if (error) {
      console.error("Error updating employee:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Unexpected error:", error);
    return false;
  }
};
