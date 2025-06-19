import { createClient } from "@/utils/supabase/server";

export const deletePromotion = async (id: number): Promise<string | null> => {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error(
        "Error de autenticación:",
        authError?.message || "Usuario no autenticado",
      );
      return "No autorizado para eliminar el servicio";
    }

    const { data: promotion, error: fetchError } = await supabase
      .from("promotions")
      .select("image, landing_page_id")
      .eq("id", id)
      .single();

    if (fetchError) {
      return "Error al obtener el servicio";
    }

    if (!promotion) {
      return "Promoción no encontrada";
    }
    const { error: deleteError } = await supabase
      .from("promotions")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return "Error al eliminar el servicio de la base de datos";
    }

    if (promotion.image) {
      try {
        const url = new URL(promotion.image);
        // La ruta en el storage es todo lo que viene después del dominio
        // Ejemplo: /storage/v1/object/public/landing-images/landing/123/services/12345-image.jpg
        // Necesitamos extraer: landing/123/services/12345-image.jpg
        const pathParts = url.pathname.split("/");
        const storagePath = pathParts.slice(5).join("/"); // Saltar /storage/v1/object/public/landing-images/

        const { error: storageError } = await supabase.storage
          .from("landing-images")
          .remove([storagePath]);

        if (storageError) {
          console.error(
            "Error al eliminar la imagen del storage:",
            storageError,
          );
          // No hacemos return aquí porque el servicio ya se eliminó de la base de datos
        } else {
          console.log("Imagen eliminada exitosamente del storage");
        }
      } catch (storageError) {
        console.error(
          "Error al procesar la eliminación de la imagen:",
          storageError,
        );
      }
    }

    return null;
  } catch (error) {
    return "Error inesperado al eliminar la promoción";
  }
};
