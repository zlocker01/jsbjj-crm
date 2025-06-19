import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";

export const deleteContactSection = async (
  id: string,
): Promise<string | undefined> => {
  const supabase = await createClient();
  const userId = await getUserId();

  const { error } = await supabase
    .from("contact_sections")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("🚀 ~ deleteContactSection error:", error.message);
    return error.message;
  }

  return;
};
