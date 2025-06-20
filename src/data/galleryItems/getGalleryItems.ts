import { createClient } from "@/utils/supabase/server";
import type { GalleryItem } from "@/interfaces/galleryItems/GalleryItem";
import { getUserId } from "@/data/getUserIdServer";

export async function getGalleryItems(
  landingPageId: string,
): Promise<GalleryItem[] | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .eq("landing_page_id", landingPageId);

    if (error) {
      console.error("Error fetching gallery items:", error.message);
      return null;
    }

    return data as GalleryItem[];
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
}
