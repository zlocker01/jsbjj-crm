import { createClient } from "@/utils/supabase/server";
import type { Service } from "@/interfaces/services/Service";

export const getService = async (id: number): Promise<Service | undefined> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error getting service:", error.message);
    return undefined;
  }

  return data as Service;
};

export const getServices = async (): Promise<Service[] | undefined> => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("services").select("*");

  if (error) {
    console.error("Error getting services:", error.message);
    return undefined;
  }

  return data as Service[];
};
