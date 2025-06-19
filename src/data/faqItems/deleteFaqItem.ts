import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";

export async function deleteFaqItem(id: number): Promise<string | undefined> {
  const supabase = await createClient();
  const userId = await getUserId();

  if (!userId) {
    return "Usuario no autenticado";
  }

  const { error } = await supabase.from("faq_items").delete().eq("id", id);

  if (error) {
    console.error("Error deleting FAQ item:", error);
    return error.message;
  }

  return undefined;
}
