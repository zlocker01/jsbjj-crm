import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import type { ChatbotRule } from "@/interfaces/chatbot/ChatbotRule";

export const getChatbotRules = async (): Promise<ChatbotRule[] | undefined> => {
  const supabase = await createClient();
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("chatbot_rules")
    .select("id, trigger, response")
    .eq("user_id", userId);

  if (error) {
    console.error("🚀 ~ getChatbotRules error:", error.message);
    return undefined;
  }

  return data as ChatbotRule[];
};
