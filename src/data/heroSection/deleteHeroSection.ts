import { createClient } from "@/utils/supabase/server";

export const deleteHeroSection = async (
  id: string,
): Promise<string | undefined> => {
  const supabase = await createClient();

  const { error } = await supabase.from("hero_sections").delete().eq("id", id);

  if (error) {
    console.error("🚀 ~ deleteHeroSection error:", error.message);
    return error.message;
  }

  return;
};
