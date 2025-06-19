import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";

export const deleteUser = async (id: string) => {
  try {
    const supabase = await createClient();
    const userId = await getUserId();

    if (!userId) {
      return null;
    }

    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error("Error deleting user:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error en deleteUser:", error);
    return false;
  }
};
