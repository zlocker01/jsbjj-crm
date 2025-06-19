import { createClient } from "@/utils/supabase/server";
import type { ContactSection } from "@/interfaces/contactSections/ContactSection";

export const updateContactSection = async (
  p0: number,
  contactSection: ContactSection,
): Promise<string | undefined> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("contact_sections")
    .update(contactSection)
    .eq("id", contactSection.id);

  if (error) {
    console.error("🚀 ~ updateContactSection error:", error.message);
    return error.message;
  }

  return;
};
