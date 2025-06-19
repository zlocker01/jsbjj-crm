import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import { EmailFormValues } from "@/interfaces/emails/EmailFormValues";

export const getEmails = async (): Promise<EmailFormValues[] | undefined> => {
  const supabase = await createClient();
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("sent_emails")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("🚀 ~ getEmails error:", error.message);
    return undefined;
  }

  return data as EmailFormValues[];
};
