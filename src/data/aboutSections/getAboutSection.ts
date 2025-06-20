import { createClient } from "@/utils/supabase/server";
import type { AboutSection } from "@/interfaces/aboutSections/AboutSection";

export const getAboutSection = async (
  landingPageId: string,
): Promise<{ data: AboutSection[] | null; error: string | undefined }> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("about_sections")
    .select("*")
    .eq("landing_page_id", landingPageId)

  if (error) {
    console.error("🚀 ~ getAboutSection error:", error.message);
    return { data: null, error: error.message };
  }

  return { data, error: undefined };
};
