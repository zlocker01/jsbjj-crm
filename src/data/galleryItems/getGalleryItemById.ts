import { createClient } from "@/utils/supabase/server";
import type { GalleryItem } from "@/interfaces/galleryItems/GalleryItem";

export async function getGalleryItemById(
  id: number,
): Promise<GalleryItem | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching gallery item:", error);
    return null;
  }

  return data;
}
