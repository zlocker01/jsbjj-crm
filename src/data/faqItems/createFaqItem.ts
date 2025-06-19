import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import type { FaqItem } from "@/interfaces/faqItems/FaqItem";

export const createFaqItem = async (
  faqItem: Omit<FaqItem, "id">,
): Promise<FaqItem | string | undefined> => {
  const supabase = await createClient();
  const userId = await getUserId();

  if (!userId) {
    return "Usuario no autenticado";
  }

  const { data, error } = await supabase
    .from("faq_items")
    .insert({ ...faqItem, user_id: userId })
    .select("*")
    .single();

  if (error) {
    console.error("🚀 ~ createFaqItem error:", error.message);
    return error.message;
  }

  return data as FaqItem;
};
