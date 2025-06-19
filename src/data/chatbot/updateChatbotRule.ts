import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import type { ChatbotRule } from "@/interfaces/chatbot/ChatbotRule";

export const updateChatbotRule = async (
  rule: ChatbotRule & { id?: number },
): Promise<string | undefined> => {
  const supabase = await createClient();
  const userId = await getUserId();

  if (rule.id) {
    const { error } = await supabase
      .from("chatbot_rules")
      .update({
        trigger: rule.trigger,
        response: rule.response,
      })
      .eq("id", rule.id)
      .eq("user_id", userId);

    if (error) {
      console.error("🚀 ~ updateChatbotRule error:", error.message);
      return error.message;
    }
  } else {
    const { error } = await supabase.from("chatbot_rules").insert({
      trigger: rule.trigger,
      response: rule.response,
      user_id: userId,
    });

    if (error) {
      console.error("🚀 ~ insertChatbotRule error:", error.message);
      return error.message;
    }
  }

  return;
};
