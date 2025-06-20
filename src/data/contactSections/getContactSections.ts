import { createClient } from "@/utils/supabase/server";
import type { ContactSection } from "@/interfaces/contactSections/ContactSection";

export const getContactSections = async (
  landingId: string,
): Promise<{
  data: ContactSection[];
  error: string | undefined;
}> => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("contact_sections")
    .select("*")
    .eq("landing_page_id", landingId);

  if (error) {
    console.error("🚀 ~ getContactSections error:", error.message);
    return { data: [], error: error.message };
  }

  return { data: data as ContactSection[], error: undefined };
};
