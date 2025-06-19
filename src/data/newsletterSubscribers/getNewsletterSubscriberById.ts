import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";

export async function getNewsletterSubscriberById(id: number) {
  const supabase = await createClient();
  const userId = await getUserId();

  if (!userId) {
    return undefined;
  }

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error al obtener suscriptor:", error.message);
    return undefined;
  }

  return data;
}
