import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";

export const createUser = async (userData: any) => {
  try {
    const supabase = await createClient();
    const userId = await getUserId();

    if (!userId) {
      return null;
    }

    const { data, error } = await supabase
      .from("users")
      .insert([{ ...userData, user_id: userId }])
      .select();

    if (error) {
      console.error("Error creating user:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error en createUser:", error);
    return null;
  }
};
