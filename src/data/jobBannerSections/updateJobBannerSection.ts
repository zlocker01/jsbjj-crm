import { createClient } from "@/utils/supabase/server";
import type { JobBannerSection } from "@/interfaces/jobBannerSections/JobBannerSection";

export const updateJobBannerSection = async (
  jobBannerSection: JobBannerSection,
): Promise<string | undefined> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("job_banner_sections")
    .update({
      title: jobBannerSection.title,
      subtitle: jobBannerSection.subtitle,
    })
    .eq("id", jobBannerSection.id);

  if (error) {
    console.error("🚀 ~ updateJobBannerSection error:", error.message);
    return error.message;
  }

  return;
};
