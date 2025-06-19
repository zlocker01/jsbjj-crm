import { createClient } from "@/utils/supabase/server";
import type { ContactSection } from "@/interfaces/contactSections/ContactSection";

export const getContactSectionById = async (
  id: number,
): Promise<ContactSection | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contact_sections")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("🚀 ~ getContactSectionById error:", error.message);
    return null;
  }

  return data as ContactSection;
};
