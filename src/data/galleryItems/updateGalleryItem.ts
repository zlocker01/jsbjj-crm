import { createClient } from "@/utils/supabase/server";

interface UpdateGalleryItemData {
  title: string;
  description?: string;
  category: string;
  is_before_after: boolean;
}

export async function updateGalleryItem(
  id: number,
  item: Partial<UpdateGalleryItemData>,
): Promise<string | null> {
  try {
    // Validar que el ID sea un número válido
    if (!id || isNaN(Number(id))) {
      console.error("ID de ítem no válido:", id);
      return "ID de ítem no válido";
    }

    // Validar campos requeridos
    if (!item.title?.trim()) {
      return "El título es requerido";
    }

    if (!item.category) {
      return "La categoría es requerida";
    }

    const supabase = await createClient();

    // Verificar si el usuario está autenticado
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error(
        "Error de autenticación:",
        authError?.message || "Usuario no autenticado",
      );
      return "No autorizado para actualizar el ítem";
    }

    const { data, error } = await supabase
      .from("gallery_items")
      .update({
        title: item.title,
        description: item.description || null,
        category: item.category,
        is_before_after: item.is_before_after || false,
      })
      .eq("id", id)
      .select("id")
      .single();

    if (error) {
      return `Error al actualizar el ítem: ${error.message}`;
    }

    if (!data) {
      return "No se encontró el ítem o no se pudo actualizar";
    }

    return data.id.toString();
  } catch (error) {
    return "Error al actualizar el ítem";
  }
}
