import { createClient } from "@/utils/supabase/server";
import type { Employee } from "@/interfaces/employees/Employee";
import { getUserId } from "@/data/getUserIdServer";

export const createEmployee = async (
  employeeData: Omit<Employee, "id" | "user_id" | "created_at" | "updated_at">,
): Promise<string | undefined> => {
  try {
    const supabase = await createClient();
    const userId = await getUserId();

    if (!userId) {
      return undefined;
    }

    const { data, error } = await supabase
      .from("employees")
      .insert([
        {
          ...employeeData,
          user_id: userId,
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("Error creating employee:", error);
      return undefined;
    }

    return data.id;
  } catch (error) {
    console.error("Unexpected error:", error);
    return undefined;
  }
};
