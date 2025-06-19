import { createClient } from "@/utils/supabase/server";
import type { Promotion } from "@/interfaces/promotions/Promotion";

export async function updatePromotion(
  id: number,
  promotionData: Partial<Omit<Promotion, "id" | "user_id">>,
): Promise<string | null> {
  try {
    // Validar que el ID sea un número válido
    if (!id || isNaN(Number(id))) {
      console.error("ID de promoción no válido:", id);
      return "ID de promoción no válido";
    }

    // Validar campos requeridos
    if (promotionData.title && !promotionData.title.trim()) {
      return "El título no puede estar vacío";
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
      return "No autorizado para actualizar el servicio";
    }

    const { data, error } = await supabase
      .from("promotions")
      .update({
        title: promotionData.title,
        description: promotionData.description || null,
        price: promotionData.price ? Number(promotionData.price) : undefined,
        discount_price: promotionData.discount_price
          ? Number(promotionData.discount_price)
          : undefined,
        valid_until: promotionData.valid_until,
        category: promotionData.category,
        duration_minutes: promotionData.duration_minutes,
      })
      .eq("id", id)
      .select("id")
      .single();

    if (error) {
      return `Error al actualizar la promoción: ${error.message}`;
    }

    if (!data) {
      return "No se encontró la promoción o no se pudo actualizar";
    }

    return data.id.toString();
  } catch (error) {
    console.error("Error inesperado al actualizar la promoción:", error);
    return "Error inesperado al actualizar la promoción";
  }
}
