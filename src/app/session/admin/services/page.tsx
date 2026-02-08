export const dynamic = 'force-dynamic';

import { getLandingId } from '@/data/getLandingId';
import { getServices } from '@/data/services/getServices';
import { createClient } from '@/utils/supabase/server';
import type { Service } from '@/interfaces/services/Service';
import { ServiceCard } from '@/components/services/ServiceCard';
import { AddServiceButton } from '@/components/services/AddServiceButton';

export default async function ServicesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-600">
          Error: Debes iniciar sesión para ver esta página.
        </p>
      </div>
    );
  }

  const landingId = await getLandingId();

  if (!landingId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-600">
          Error: No se pudo cargar la página de clases. No se encontró el ID de
          la landing page.
        </p>
      </div>
    );
  }

  const services: Service[] | null = await getServices(landingId);

  if (!services) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-600">
          Error: No se pudieron cargar las clases. Inténtalo de nuevo más tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center mb-8 flex-col md:flex-row gap-4">
        <div>
          <h2 className="text-3xl font-bold">Clases</h2>
          <p className="text-muted-foreground">
            Administra las clases de tu academia
          </p>
        </div>
        <AddServiceButton landingId={landingId} />
      </div>

      {services?.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No hay clases aún</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services?.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
