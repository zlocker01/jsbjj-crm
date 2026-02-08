import { createClient } from '@/utils/supabase/server';
import type { Service } from '@/interfaces/services/Service';

export const getServices = async (
  landingPageId: string,
): Promise<Service[] | null> => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('landing_page_id', landingPageId);

    if (error) {
      console.error('Error fetching services:', error.message);
      return null;
    }

    return data as Service[];
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
};
