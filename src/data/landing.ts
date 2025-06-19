import { createClient } from "@/utils/supabase/server";
import type {
  PromotionsContent,
  FaqContent,
  FeatureItem,
  HeroContent,
  AboutContent,
  GalleryContent,
  ContactContent,
} from "@/interfaces/landing";

// Cliente de Supabase
const supabase =  await createClient();

/**
 * Funciones para gestionar las secciones de landing page en Supabase
 */

// Promociones
export async function updatePromotions(
  promotionsData: PromotionsContent,
  userId: string,
) {
  try {
    const { data, error } = await supabase.from("landing_sections").upsert(
      {
        user_id: userId,
        section_type: "promotions",
        content: promotionsData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,section_type" },
    );

    if (error) {
      throw error;
    }
    return { success: true, data };
  } catch (error) {
    console.error("Error al actualizar promociones:", error);
    return { success: false, error };
  }
}

// FAQ
export async function updateFaq(faqData: FaqContent, userId: string) {
  try {
    const { data, error } = await supabase.from("landing_sections").upsert(
      {
        user_id: userId,
        section_type: "faq",
        content: faqData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,section_type" },
    );

    if (error) {
      throw error;
    }
    return { success: true, data };
  } catch (error) {
    console.error("Error al actualizar FAQ:", error);
    return { success: false, error };
  }
}

// Features/Servicios
export async function updateFeatures(
  featuresData: FeatureItem[],
  userId: string,
) {
  try {
    const { data, error } = await supabase.from("landing_sections").upsert(
      {
        user_id: userId,
        section_type: "features",
        content: { items: featuresData },
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,section_type" },
    );

    if (error) {
      throw error;
    }
    return { success: true, data };
  } catch (error) {
    console.error("Error al actualizar servicios:", error);
    return { success: false, error };
  }
}

// Hero
export async function updateHero(heroData: HeroContent, userId: string) {
  try {
    const { data, error } = await supabase.from("landing_sections").upsert(
      {
        user_id: userId,
        section_type: "hero",
        content: heroData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,section_type" },
    );

    if (error) {
      throw error;
    }
    return { success: true, data };
  } catch (error) {
    console.error("Error al actualizar hero:", error);
    return { success: false, error };
  }
}

// About
export async function updateAbout(aboutData: AboutContent, userId: string) {
  try {
    const { data, error } = await supabase.from("landing_sections").upsert(
      {
        user_id: userId,
        section_type: "about",
        content: aboutData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,section_type" },
    );

    if (error) {
      throw error;
    }
    return { success: true, data };
  } catch (error) {
    console.error("Error al actualizar about:", error);
    return { success: false, error };
  }
}

// Gallery
export async function updateGallery(
  galleryData: GalleryContent,
  userId: string,
) {
  try {
    const { data, error } = await supabase.from("landing_sections").upsert(
      {
        user_id: userId,
        section_type: "gallery",
        content: galleryData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,section_type" },
    );

    if (error) {
      throw error;
    }
    return { success: true, data };
  } catch (error) {
    console.error("Error al actualizar galería:", error);
    return { success: false, error };
  }
}

// Contact
export async function updateContact(
  contactData: ContactContent,
  userId: string,
) {
  try {
    const { data, error } = await supabase.from("landing_sections").upsert(
      {
        user_id: userId,
        section_type: "contact",
        content: contactData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,section_type" },
    );

    if (error) {
      throw error;
    }
    return { success: true, data };
  } catch (error) {
    console.error("Error al actualizar contacto:", error);
    return { success: false, error };
  }
}

// Obtener todas las secciones de landing para un usuario
export async function getLandingSections(userId: string) {
  try {
    const { data, error } = await supabase
      .from("landing_sections")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      throw error;
    }
    return { success: true, data };
  } catch (error) {
    console.error("Error al obtener secciones de landing:", error);
    return { success: false, error };
  }
}
