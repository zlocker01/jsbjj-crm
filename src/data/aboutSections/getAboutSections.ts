import { createClient } from "@/utils/supabase/server";
import type { AboutSection } from "@/interfaces/aboutSections/AboutSection";

export const getAboutSections = async (): Promise<
  AboutSection[] | undefined
> => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("about_sections").select("*");

  if (error) {
    console.error("🚀 ~ getAboutSections error:", error.message);
    return undefined;
  }

  return data as AboutSection[];
};
