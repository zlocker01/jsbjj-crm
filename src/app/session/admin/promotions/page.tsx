export const dynamic = 'force-dynamic';

import { getLandingId } from "@/data/getLandingId";
import { createClient } from "@/utils/supabase/server";
import { AddPromotionButton } from "@/components/promotions/AddPromotionButton";
import { getPromotions } from "@/data/promotions/getPromotion";
import { PromotionCard } from "@/components/promotions/PromotionCard";
import type { Promotion } from "@/interfaces/promotions/Promotion";

export default async function PromotionsPage() {
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
          Error: No se pudo cargar la página de promociones. No se encontró el ID
          de la landing page.
        </p>
      </div>
    );
  }

  const promotions: Promotion[] | null = await getPromotions(landingId);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center mb-8 flex-col md:flex-row gap-4">
        <div>
          <h2 className="text-3xl font-bold">Promociones</h2>
          <p className="text-muted-foreground">
            Administra las promociones de tu negocio
          </p>
        </div>
        <AddPromotionButton landingId={landingId} />
      </div>

      {!promotions || promotions.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No hay promociones aún</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promotion) => (
            <PromotionCard key={promotion.id} promotion={promotion} />
          ))}
        </div>
      )}
    </div>
  );
}
