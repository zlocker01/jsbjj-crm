import { createClient } from '@/utils/supabase/server';
import type { Package } from '@/interfaces/packages/Package';

export const getPackages = async (
  landingPageId: string,
): Promise<Package[] | null> => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('landing_page_id', landingPageId);

    if (error) {
      console.error('Error fetching packages:', error.message);
      return null;
    }

    return data as Package[];
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
};
