import { createClient } from '@/utils/supabase/server';
import type { Package } from '@/interfaces/packages/Package';

export async function updatePackage(
  id: number,
  packageData: Partial<Omit<Package, 'id' | 'created_at'>>,
): Promise<string | null> {
  try {
    // Validar que el ID sea un número válido
    if (!id || isNaN(Number(id))) {
      console.error('ID de paquete no válido:', id);
      return 'ID de paquete no válido';
    }

    // Validar campos requeridos básicos si vienen
    if (packageData.name !== undefined && !packageData.name.trim()) {
      return 'El nombre del plan no puede estar vacío';
    }

    const supabase = await createClient();

    // Verificar si el usuario está autenticado
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error(
        'Error de autenticación:',
        authError?.message || 'Usuario no autenticado',
      );
      return 'No autorizado para actualizar el paquete';
    }

    const { data, error } = await supabase
      .from('packages')
      .update({
        name: packageData.name,
        price: packageData.price,
        subtitle: packageData.subtitle,
        image: packageData.image,
        benefits: packageData.benefits || [],
        restrictions: packageData.restrictions || [],
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select('id')
      .single();

    if (error) {
      return `Error al actualizar el paquete: ${error.message}`;
    }

    if (!data) {
      return 'No se encontró el paquete o no se pudo actualizar';
    }

    return data.id.toString();
  } catch (error) {
    console.error('Error inesperado al actualizar el paquete:', error);
    return 'Error inesperado al actualizar el paquete';
  }
}
