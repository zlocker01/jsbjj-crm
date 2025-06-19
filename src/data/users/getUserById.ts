import { createClient } from "@/utils/supabase/server";

export const getUserById = async (user_id: string) => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user_id)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error en getUserById:", error);
    return null;
  }
};
