import { createClient } from '@/utils/supabase/server';
import { getUserId } from '@/data/getUserIdServer';
import type { Client } from '@/interfaces/client/Client';
import { getUserRole } from '@/data/getUserRole';

export const postClient = async (
  clientData: Omit<Client, 'id' | 'user_id' | 'client_source'>,
): Promise<boolean> => {
  const supabase = await createClient();
  const userId = await getUserId();
  const userRole = await getUserRole();

  const { appointments, ...cleanData } = clientData as any;
  
  // Explicitly remove is_active if present
  delete cleanData.is_active;

  // Convert empty strings to null for UUID fields to avoid syntax errors
  if (cleanData.package_id === '') {
    cleanData.package_id = null;
  }

  const { error } = await supabase.from("clients").insert([
    {
      ...cleanData,
      user_id: userId,
      registration_date:
        clientData.registration_date || new Date().toISOString(),
      client_source: userRole || 'empleado',
    },
  ]);

  if (error) {
    console.error('🚀 ~ postClient error:', error.message);
    return false;
  }

  return true;
};
