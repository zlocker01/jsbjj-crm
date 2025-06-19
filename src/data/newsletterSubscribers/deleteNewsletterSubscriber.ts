import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";

export const deleteNewsletterSubscriber = async (
  id: number,
): Promise<boolean | undefined> => {
  const supabase = await createClient();
  const userId = await getUserId();

  if (!userId) {
    console.error("Usuario no autenticado");
    return undefined;
  }

  const { error } = await supabase
    .from("newsletter_subscribers")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("Error eliminando suscriptor:", error.message);
    return undefined;
  }

  return true;
};
