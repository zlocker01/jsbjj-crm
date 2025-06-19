import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import { EmailFormValues } from "@/interfaces/emails/EmailFormValues";

export const getEmailById = async (
  id: number,
): Promise<EmailFormValues | undefined> => {
  const supabase = await createClient();
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("sent_emails")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("🚀 ~ getEmailById error:", error.message);
    return undefined;
  }

  return data as EmailFormValues;
};
