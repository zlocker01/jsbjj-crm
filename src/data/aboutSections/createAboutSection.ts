import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import type { AboutSection } from "@/interfaces/aboutSections/AboutSection";

export const createAboutSection = async (
  aboutSection: Omit<AboutSection, "id">,
): Promise<string | undefined> => {
  const supabase = await createClient();
  const userId = await getUserId();

  const { error } = await supabase
    .from("about_sections")
    .insert({ ...aboutSection, user_id: userId });

  if (error) {
    console.error("🚀 ~ createAboutSection error:", error.message);
    return error.message;
  }

  return;
};
