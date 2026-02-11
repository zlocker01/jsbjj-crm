export const dynamic = 'force-dynamic';

import { getLandingId } from '@/data/getLandingId';
import { getPackages } from '@/data/packages/getPackages';
import { createClient } from '@/utils/supabase/server';
import type { Package } from '@/interfaces/packages/Package';
import { PackageCard } from '@/components/packages/PackageCard';
import { AddPackageButton } from '@/components/packages/AddPackageButton';

export default async function PackagesPage() {
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
          Error: No se pudo cargar la página de paquetes. No se encontró el ID
          de la landing page.
        </p>
      </div>
    );
  }

  const packages: Package[] | null = await getPackages(landingId);

  if (!packages) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-600">
          Error: No se pudieron cargar los paquetes. Inténtalo de nuevo más
          tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center mb-8 flex-col md:flex-row gap-4">
        <div>
          <h2 className="text-3xl font-bold">Paquetes</h2>
          <p className="text-muted-foreground">
            Administra los paquetes de precios y planes
          </p>
        </div>
        <AddPackageButton landingId={landingId} />
      </div>

      {packages?.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
          <p className="text-muted-foreground mb-4">No hay paquetes aún</p>
          <AddPackageButton landingId={landingId} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages?.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}
    </div>
  );
}
