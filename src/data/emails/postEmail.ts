import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import { EmailFormValues } from "@/interfaces/emails/EmailFormValues";

export const postEmail = async (
  emailData: EmailFormValues,
): Promise<boolean> => {
  const supabase = await createClient();
  const userId = await getUserId();

  const { error } = await supabase.from("sent_emails").insert([
    {
      user_id: userId,
      recipient_email: emailData.recipient_email,
      recipient_name: emailData.recipient_name,
      subject: emailData.subject,
      body: emailData.body,
      scheduled: emailData.scheduled ?? false,
      scheduled_date: emailData.scheduled_date ?? null,
      scheduled_time: emailData.scheduled_time ?? null,
      template_id_used: emailData.template_id_used ?? null,
    },
  ]);

  if (error) {
    console.error("🚀 ~ postEmail error:", error.message);
    return false;
  }

  return true;
};
