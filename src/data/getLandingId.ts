import { createClient } from "@/utils/supabase/server";
import { getUserId } from "./getUserIdServer";
// Configuración para forzar el modo dinámico y evitar errores de generación estática
export const dynamic = 'force-dynamic';

// Función para esperar un tiempo determinado
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getLandingId = async (): Promise<string | null> => {
  const MAX_RETRIES = 2;
  let retries = 0;

  while (retries <= MAX_RETRIES) {
    try {
      const supabase = await createClient();
      const userId = await getUserId();

      if (!userId) {
        console.warn(
          `Intento ${retries + 1}/${MAX_RETRIES + 1}: No se pudo obtener el ID del usuario`,
        );

        if (retries < MAX_RETRIES) {
          retries++;
          // Esperar antes de reintentar (backoff exponencial)
          await sleep(1000 * Math.pow(2, retries - 1));
          continue;
        }

        console.error(
          "No se pudo obtener el ID del usuario después de varios intentos",
        );
        return null;
      }

      const { data, error } = await supabase
        .from("landing_pages")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error(
          "Error al consultar la tabla landing_pages:",
          error.message,
        );
        return null;
      }

      if (!data) {
        console.warn(`No se encontró landing page para el user_id: ${userId}`);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error("Error en getLandingId:", error);

      if (retries < MAX_RETRIES) {
        retries++;
        // Esperar antes de reintentar
        await sleep(1000 * Math.pow(2, retries - 1));
      } else {
        return null;
      }
    }
  }

  return null;
};
