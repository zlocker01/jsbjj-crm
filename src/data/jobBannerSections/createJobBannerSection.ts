import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import type { JobBannerSection } from "@/interfaces/jobBannerSections/JobBannerSection";

export const createJobBannerSection = async (
  jobBannerSection: Omit<JobBannerSection, "id">,
): Promise<{ data?: JobBannerSection; error?: string }> => {
  const supabase = await createClient();
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("job_banner_sections")
    .insert({ ...jobBannerSection, user_id: userId })
    .select()
    .single();

  if (error) {
    console.error("🚀 ~ createJobBannerSection error:", error.message);
    return { error: error.message };
  }

  return { data };
};
