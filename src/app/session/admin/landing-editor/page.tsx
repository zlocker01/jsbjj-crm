export const dynamic = 'force-dynamic';

import { ClientWrapper } from "./client-wrapper";
import { getLandingId } from "@/data/getLandingId";
import { getHeroSection } from "@/data/heroSection/getHeroSection";
import { getAboutSection } from "@/data/aboutSections/getAboutSection";
import { getJobBannerSections } from "@/data/jobBannerSections/getJobBannerSections";
import { getContactSections } from "@/data/contactSections/getContactSections";
import { getFaqItems } from "@/data/faqItems/getFaqItems";
import { getGalleryItems } from "@/data/galleryItems/getGalleryItems";
import { getServices } from "@/data/services/getServices";

export default async function LandingEditorPage() {
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

  const { data: heroData } = await getHeroSection(landingId);
  const { data: aboutData } = await getAboutSection(landingId);
  const { data: jobBannerData } = await getJobBannerSections(landingId);
  const { data: contactData } = await getContactSections(landingId);
  const faqData = await getFaqItems(landingId);

  const initialContent = {
    hero: heroData?.[0] || {},
    about: aboutData?.[0] || {},
    contact: contactData?.[0] || {},
    jobBanner: jobBannerData?.[0] || {},
    faq: { items: faqData || [] }, // Ahora faqData es directamente el array o undefined
  };

  return (
    <ClientWrapper landingId={landingId} initialContent={initialContent} />
  );
}
