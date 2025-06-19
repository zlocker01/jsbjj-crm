import { createClient } from "@/utils/supabase/client";

export const updateUser = async (id: string, userData: any) => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("users")
      .update(userData)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating user:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error en updateUser:", error);
    return null;
  }
};
