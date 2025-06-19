import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import type { JobBannerSection } from "@/interfaces/jobBannerSections/JobBannerSection";

export const getJobBannerSections = async (
  landingPageId: string,
): Promise<{ data: JobBannerSection[] | null; error: string | undefined }> => {
  const supabase = await createClient();
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("job_banner_sections")
    .select("*")
    .eq("landing_page_id", landingPageId)
    .eq("user_id", userId);

  if (error) {
    console.error("🚀 ~ getJobBannerSections error:", error.message);
    return { data: null, error: error.message };
  }

  return { data, error: undefined };
};
