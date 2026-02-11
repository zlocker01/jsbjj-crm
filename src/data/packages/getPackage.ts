import { createClient } from '@/utils/supabase/server';
import type { Package } from '@/interfaces/packages/Package';

export const getPackage = async (id: number): Promise<Package | undefined> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error getting package:', error.message);
    return undefined;
  }

  return data as Package;
};
