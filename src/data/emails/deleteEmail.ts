import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";

export const deleteEmail = async (id: number): Promise<string | undefined> => {
  const supabase = await createClient();
  const userId = await getUserId();

  const { error } = await supabase
    .from("sent_emails")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("🚀 ~ deleteEmail error:", error.message);
    return error.message;
  }

  return;
};
