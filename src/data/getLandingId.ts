import { createClient } from "@/utils/supabase/server";
import { getUserId } from "./getUserIdServer";
import { unstable_noStore as noStore } from 'next/cache';

export const getLandingId = async (): Promise<string | null> => {
  noStore();
  const supabase = await createClient();
  
  // Intenta obtener el userId, pero no fallamos si no está disponible
  let userId = null;
  try {
    userId = await getUserId();
  } catch (error) {
    console.log("Usuario no autenticado, usando landing page predeterminada");
  }
  
  let query = supabase.from("landing_pages").select("id");
  
  // Si tenemos un userId, filtramos por él
  if (userId) {
    query = query.eq("user_id", userId);
  } else {
    // Si no hay usuario, obtenemos una landing page predeterminada o la más reciente
    // Puedes adaptar esto según tu estructura de datos
    query = query.eq("is_default", true).order('created_at', { ascending: false });
  }
  
  const { data, error } = await query.maybeSingle();
  
  if (error) {
    console.error("Error al consultar la tabla landing_pages:", error.message);
    return null;
  }
  
  // Si no hay datos con los filtros anteriores, intenta obtener cualquier landing page
  if (!data) {
    const { data: anyLanding, error: anyError } = await supabase
      .from("landing_pages")
      .select("id")
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (anyError || !anyLanding) {
      return null;
    }
    
    return anyLanding.id;
  }
  
  return data.id;
};