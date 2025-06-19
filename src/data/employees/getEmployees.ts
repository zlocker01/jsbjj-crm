import { createClient } from "@/utils/supabase/server";
import type { Employee } from "@/interfaces/employees/Employee";

export const getEmployees = async (): Promise<Employee[] | null> => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.from("employees").select("*");

    if (error) {
      console.error("Error fetching employees:", error.message);
      return null;
    }

    return data as Employee[];
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};
