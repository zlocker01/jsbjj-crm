import { createClient } from "@/utils/supabase/server";
import type { JobBannerSection } from "@/interfaces/jobBannerSections/JobBannerSection";

export const getJobBannerSections = async (
  landingPageId: string,
): Promise<{ data: JobBannerSection[] | null; error: string | undefined }> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("job_banner_sections")
    .select("*")
    .eq("landing_page_id", landingPageId)

  if (error) {
    console.error("🚀 ~ getJobBannerSections error:", error.message);
    return { data: null, error: error.message };
  }

  return { data, error: undefined };
};
