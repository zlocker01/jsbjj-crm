import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";

export const getUserFromTable = async () => {
  try {
    const supabase = await createClient();

    const userId = await getUserId();

    if (!userId) {
      return null;
    }

    const { data: userData, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error(`Error fetching user data for ${userId}:`, error);

      // Si el error es que no hay filas, podemos devolver un objeto con valores predeterminados
      if (error.code === "PGRST116") {
        console.log(
          "Usuario no encontrado en la tabla usuarios, usando valores por defecto",
        );
        return {
          user_id: userId,
          generations_remaining: null, // Esto indicará generaciones ilimitadas
        };
      }

      return null;
    }

    return userData;
  } catch (error) {
    console.error("Error en getUserFromTable:", error);
    return null;
  }
};
