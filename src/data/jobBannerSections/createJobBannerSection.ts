import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import type { JobBannerSection } from "@/interfaces/jobBannerSections/JobBannerSection";

export const createJobBannerSection = async (
  jobBannerSection: Omit<JobBannerSection, "id">,
): Promise<string | undefined> => {
  const supabase = await createClient();
  const userId = await getUserId();

  const { error } = await supabase
    .from("job_banner_sections")
    .insert({ ...jobBannerSection, user_id: userId });

  if (error) {
    console.error("🚀 ~ createJobBannerSection error:", error.message);
    return error.message;
  }

  return;
};
