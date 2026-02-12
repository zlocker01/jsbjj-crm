import { createClient } from '@/utils/supabase/server';
import type { Client } from '@/interfaces/client/Client';

export const updateClient = async (
  id: string,
  clientData: Partial<Client>,
): Promise<string | undefined> => {
  const supabase = await createClient();

  // Extract appointments to avoid sending them to DB (relation)
  // Ensure we are not sending is_active if it still exists in the type somehow
  const { appointments, ...cleanData } = clientData as any;

  // Explicitly remove is_active if present in the data object to avoid DB conflicts if column was removed
  delete cleanData.is_active;

  // Convert empty strings to null for UUID fields to avoid syntax errors
  if (cleanData.package_id === '') {
    cleanData.package_id = null;
  }

  console.log('--- START UPDATE CLIENT ---');
  console.log('Target ID:', id);
  console.log('Payload keys:', Object.keys(cleanData));
  if ('status' in cleanData) {
    console.log('Status update value:', cleanData.status);
  } else {
    console.warn(
      '⚠️ WARNING: "status" field is MISSING in the update payload!',
    );
  }

  const { data, error } = await supabase
    .from('clients')
    .update(cleanData)
    .eq('id', id)
    .select();

  if (error) {
    console.error('❌ updateClient DB Error:', error.message);
    console.error('Error details:', error);
    return error.message;
  }

  console.log('✅ Update success. Rows affected:', data?.length);
  if (data && data.length > 0) {
    const updatedRecord = data[0];
    console.log('Updated record status:', updatedRecord.status);

    // CRITICAL CHECK: Did the status actually change?
    if (cleanData.status && updatedRecord.status !== cleanData.status) {
      const msg = `CRITICAL: Status update failed silently. Requested '${cleanData.status}', but DB returned '${updatedRecord.status}'. This usually means the 'status' column does not exist in the database or is read-only.`;
      console.error(msg);
      return "Error: La base de datos no tiene la columna 'status'. Ejecuta la migración SQL.";
    }
  } else {
    console.warn(
      '⚠️ Update returned success but NO rows were returned (Record not found or RLS policy?)',
    );
  }
  console.log('--- END UPDATE CLIENT ---');

  return;
};
