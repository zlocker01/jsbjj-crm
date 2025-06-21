import { createClient } from "@/utils/supabase/server";

export const deleteClient = async (id: string): Promise<string | undefined> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("🚀 ~ deleteClient error:", error.message);
    return error.message;
  }

  return;
};
