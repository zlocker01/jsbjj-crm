import { createClient } from "@/utils/supabase/server";
import type { HeroSection } from "@/interfaces/heroSection/Interface";

export const updateHeroSection = async (
  heroSection: HeroSection,
): Promise<string | undefined> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("hero_sections")
    .update(heroSection)
    .eq("id", heroSection.id);

  if (error) {
    console.error("🚀 ~ updateHeroSection error:", error.message);
    return error.message;
  }

  return;
};
