import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import { EmailFormValues } from "@/interfaces/emails/EmailFormValues";

export const updateEmail = async (
  id: number,
  emailData: Partial<EmailFormValues>,
): Promise<string | undefined> => {
  const supabase = await createClient();
  const userId = await getUserId();

  const { error } = await supabase
    .from("sent_emails")
    .update(emailData)
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("🚀 ~ updateEmail error:", error.message);
    return error.message;
  }

  return;
};
