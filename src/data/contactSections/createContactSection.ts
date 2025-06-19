import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import type { ContactSection } from "@/interfaces/contactSections/ContactSection";

export const createContactSection = async (
  contactSection: Omit<ContactSection, "id">,
): Promise<string | undefined> => {
  const supabase = await createClient();
  const userId = await getUserId();

  const { error } = await supabase
    .from("contact_sections")
    .insert({ ...contactSection, user_id: userId });

  if (error) {
    console.error("🚀 ~ createContactSection error:", error.message);
    return error.message;
  }

  return;
};
