import { createClient } from "@/utils/supabase/server";
import { unstable_noStore as noStore } from 'next/cache';
import { LandingPage } from "@/interfaces/landingPages/LandingPage";

export const getLandingId = async (): Promise<string | null> => {
  const supabase = await createClient();
  noStore();

  let query = supabase.from("landing_pages").select("*").maybeSingle();

  const { data, error } = await query;

  if (error || !data) {
    console.error("Error al consultar la tabla landing_pages:", error?.message);
    return null;
  }

  const landingPage: LandingPage = data;

  return landingPage.id;
};