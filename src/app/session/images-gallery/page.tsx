export const dynamic = 'force-dynamic';

import { getLandingId } from "@/data/getLandingId";
import { getGalleryItems } from "@/data/galleryItems/getGalleryItems";
import { createClient } from "@/utils/supabase/server";
import AddGalleryItemModal from "@/components/gallery/AddGalleryItemModal";
import DeleteGalleryItemButton from "@/components/gallery/DeleteGalleryItemButton";
import EditGalleryItemButton from "@/components/gallery/EditGalleryItemButton";
import type { GalleryItem } from "@/interfaces/galleryItems/GalleryItem";

export default async function ImagesGallery() {
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
          Error: No se pudo cargar la página de edición. No se encontró el ID de
          la landing page.
        </p>
      </div>
    );
  }

  const galleryItems = await getGalleryItems(landingId);
  if (!galleryItems) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-600">
          Error: No se pudo cargar la galería. Inténtalo de nuevo más tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Galería de Imágenes</h1>
          <p className="text-muted-foreground">
            En esta sección puedes gestionar las imágenes para tu landing page.
          </p>
        </div>
        <AddGalleryItemModal landingId={landingId} />
      </div>

      {galleryItems.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-gray-600 mb-4">
            No hay imágenes en la galería aún.
          </p>
          <AddGalleryItemModal landingId={landingId} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleryItems.map((item: GalleryItem) => (
            <div
              key={item.id}
              className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-w-16 aspect-h-9 w-full relative">
                <img
                  src={item.image}
                  alt={item.title || "Imagen de galería"}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 z-10">
                  <div className="grid grid-cols-2 grid-rows-1 gap-2">
                    <EditGalleryItemButton item={item} />
                    <DeleteGalleryItemButton
                      itemId={item.id}
                      imageUrl={item.image}
                      itemTitle={item.title}
                    />
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none">
                  <h3 className="text-white font-semibold text-lg pointer-events-auto">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-gray-200 text-sm mt-1 line-clamp-2 pointer-events-auto">
                      {item.description}
                    </p>
                  )}
                  <div className="mt-2 pointer-events-auto">
                    <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.category || "Sin categoría"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
