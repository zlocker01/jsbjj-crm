import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import type { JobBannerSection } from "@/interfaces/jobBannerSections/JobBannerSection";

export const getJobBannerSectionById = async (
  id: number,
): Promise<{ data: JobBannerSection | null; error: string | undefined }> => {
  const supabase = await createClient();
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("job_banner_sections")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("🚀 ~ getJobBannerSectionById error:", error.message);
    return { data: null, error: error.message };
  }

  return { data, error: undefined };
};
