import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import type { HeroSection } from "@/interfaces/heroSection/Interface";

export const createHeroSection = async (
  heroSection: Omit<HeroSection, "id">,
): Promise<{ data: HeroSection | null; error: string | undefined }> => {
  const supabase = await createClient();
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("hero_sections")
    .insert({ ...heroSection, user_id: userId })
    .select()
    .single();

  if (error) {
    console.error("🚀 ~ createHeroSection error:", error.message);
    return { data: null, error: error.message };
  }

  return { data, error: undefined };
};
