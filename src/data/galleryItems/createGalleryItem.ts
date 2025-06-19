import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";

export async function createGalleryItem(
  item: any,
): Promise<string | undefined> {
  try {
    const supabase = await createClient();
    const userId = await getUserId();

    if (!userId) {
      return undefined;
    }

    const { data, error } = await supabase
      .from("gallery_items")
      .insert([
        {
          ...item,
          user_id: userId,
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("Error creating gallery item:", error);
      return undefined;
    }

    return data.id;
  } catch (error) {
    console.error("Unexpected error:", error);
    return undefined;
  }
}
