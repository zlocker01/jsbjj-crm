import { createClient } from "@/utils/supabase/server";

export async function deleteGalleryItem(id: number) {
  console.log("Iniciando deleteGalleryItem para el ID:", id);
  const supabase = await createClient();

  try {
    console.log("Obteniendo información del ítem de la base de datos...");
    // 1. Primero obtenemos el ítem para tener la URL de la imagen
    const { data: item, error: fetchError } = await supabase
      .from("gallery_items")
      .select("image, landing_page_id")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error al obtener el ítem:", fetchError);
      throw fetchError;
    }

    if (!item) {
      console.error("Item no encontrado en la base de datos");
      throw new Error("Item no encontrado");
    }

    console.log("Eliminando ítem de la base de datos...");
    // 2. Eliminamos el ítem de la base de datos
    const { error: deleteError } = await supabase
      .from("gallery_items")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error al eliminar de la base de datos:", deleteError);
      throw deleteError;
    }

    console.log("Ítem eliminado de la base de datos. Verificando imagen...");
    // 3. Si existe una imagen, la eliminamos del storage
    if (item.image) {
      try {
        console.log("Imagen encontrada, preparando para eliminar:", item.image);

        // Extraer el nombre del archivo de la URL
        const url = new URL(item.image);
        // La ruta en el storage es todo lo que viene después del dominio
        // Ejemplo: /storage/v1/object/public/landing-images/landing/123/gallery/12345-image.jpg
        // Necesitamos extraer: landing/123/gallery/12345-image.jpg
        const pathParts = url.pathname.split("/");
        const storagePath = pathParts.slice(5).join("/"); // Saltar /storage/v1/object/public/landing-images/

        console.log("Eliminando imagen del storage en ruta:", storagePath);

        const { error: storageError } = await supabase.storage
          .from("landing-images")
          .remove([storagePath]);

        if (storageError) {
          console.error(
            "Error al eliminar la imagen del storage:",
            storageError,
          );
        } else {
          console.log("Imagen eliminada exitosamente del storage");
        }
      } catch (storageError) {
        console.error(
          "Excepción al eliminar la imagen del storage:",
          storageError,
        );
        // No lanzamos el error para no fallar si solo falla el borrado del storage
      }
    } else {
      console.log("No se encontró imagen para eliminar");
    }

    console.log("deleteGalleryItem completado exitosamente para ID:", id);
    return null;
  } catch (error) {
    console.error("Error en deleteGalleryItem para ID", id, ":", error);
    return error instanceof Error
      ? error.message
      : "Error desconocido al eliminar el ítem";
  }
}
