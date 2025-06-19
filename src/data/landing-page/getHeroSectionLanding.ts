import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import { HeroSection } from "@/interfaces/heroSection/Interface";

export const getHeroSection = async (
  landingPageId: string,
): Promise<{ data: HeroSection[] | null; error: string | undefined }> => {
  const supabase = await createClient();
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("hero_sections")
    .select("*")
    .eq("landing_page_id", landingPageId)
    .eq("user_id", userId);

  if (error) {
    console.error("🚀 ~ getHeroSection error:", error.message);
    return { data: null, error: error.message };
  }

  return { data, error: undefined };
};
