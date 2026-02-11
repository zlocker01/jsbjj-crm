import { createClient } from '@/utils/supabase/server';

export const deletePackage = async (id: number): Promise<string | null> => {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error(
        'Error de autenticación:',
        authError?.message || 'Usuario no autenticado',
      );
      return 'No autorizado para eliminar el paquete';
    }

    const { data: pkg, error: fetchError } = await supabase
      .from('packages')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError) {
      return 'Error al obtener el paquete';
    }

    if (!pkg) {
      return 'Paquete no encontrado';
    }

    const { error: deleteError } = await supabase
      .from('packages')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error detallado de Supabase:', deleteError);
      return `Error al eliminar el paquete: ${deleteError.message}`;
    }

    return null;
  } catch (error) {
    return 'Error inesperado al eliminar el paquete';
  }
};
