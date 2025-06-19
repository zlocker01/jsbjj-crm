import { createClient } from "@/utils/supabase/server";
import type { AboutSection } from "@/interfaces/aboutSections/AboutSection";

export const updateAboutSection = async (
  aboutSection: AboutSection,
): Promise<string | undefined> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("about_sections")
    .update(aboutSection)
    .eq("id", aboutSection.id);

  if (error) {
    console.error("🚀 ~ updateAboutSection error:", error.message);
    return error.message;
  }

  return;
};
