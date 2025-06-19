import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import type { AboutSection } from "@/interfaces/aboutSections/AboutSection";

export const getAboutSection = async (
  landingPageId: string,
): Promise<{ data: AboutSection[] | null; error: string | undefined }> => {
  const supabase = await createClient();
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("about_sections")
    .select("*")
    .eq("landing_page_id", landingPageId)
    .eq("user_id", userId);

  if (error) {
    console.error("🚀 ~ getAboutSection error:", error.message);
    return { data: null, error: error.message };
  }

  return { data, error: undefined };
};
