import { createClient } from "@/utils/supabase/server";
import type { CombinedUser } from "@/interfaces/documents/CombinedUser";

export const getUser = async (): Promise<CombinedUser | null> => {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user) {
    console.error("Error fetching auth user or no user found:", authError);
    return null;
  }

  const authUser = authData.user;

  let subscriptionData = null;
  // --- Update the select query ---
  const { data: fetchedSubData, error: subError } = await supabase
    .from("suscripciones")
    // Select the new columns along with the existing ones
    .select(
      "stripe_price_id, stripe_customer_id, status, trial_ends_at, current_period_ends_at",
    )
    .eq("user_id", authUser.id)
    .maybeSingle(); // User might not have a subscription row

  if (subError) {
    console.error("Error fetching subscription data:", subError.message);
  } else {
    subscriptionData = fetchedSubData;
  }

  // 3. Combine data from Auth and Subscriptions
  const combinedUser: CombinedUser = {
    id: authUser.id,
    email: authUser.email,
    name: authUser.user_metadata?.name,
    role: authUser.user_metadata?.role || "user",
    stripe_customer_id: subscriptionData?.stripe_customer_id || null,
    stripe_price_id: subscriptionData?.stripe_price_id || null,
    status: subscriptionData?.status || null,
    trial_ends_at: subscriptionData?.trial_ends_at || null,
    current_period_ends_at: subscriptionData?.current_period_ends_at || null,
    // Note: generations_remaining is part of the interface but not populated here yet.
  };

  return combinedUser;
};
