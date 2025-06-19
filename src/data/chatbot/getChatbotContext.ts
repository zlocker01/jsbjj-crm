import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import type { ChatbotContext } from "@/interfaces/chatbot/ChatbotContext";

export const getChatbotContext = async (): Promise<
  ChatbotContext | undefined
> => {
  const supabase = await createClient();
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("chatbot_context")
    .select(
      `
        business_name,
        business_type,
        services,
        opening_hours,
        contact_info,
        faq
      `,
    )
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("🚀 ~ getChatbotContext error:", error.message);
    return undefined;
  }

  const mappedContext: ChatbotContext = {
    businessName: data.business_name,
    businessType: data.business_type,
    services: data.services,
    openingHours: data.opening_hours,
    contactInfo: data.contact_info,
    faq: data.faq,
  };

  return mappedContext;
};
