import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import type { ChatbotContext } from "@/interfaces/chatbot/ChatbotContext";

export const updateChatbotContext = async (
  values: ChatbotContext,
): Promise<string | undefined> => {
  const supabase = await createClient();
  const userId = await getUserId();

  const mappedValues = {
    business_name: values.businessName,
    business_type: values.businessType,
    services: values.services,
    opening_hours: values.openingHours,
    contact_info: values.contactInfo,
    faq: values.faq,
    user_id: userId,
  };

  const { error: updateError } = await supabase
    .from("chatbot_context")
    .update(mappedValues)
    .eq("user_id", userId);

  if (updateError) {
    console.error("🚀 ~ updateChatbotContext error:", updateError.message);
    return updateError.message;
  }

  return;
};
