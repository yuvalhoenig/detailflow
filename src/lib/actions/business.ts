import "server-only";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// Signup creates the auth user before email confirmation completes, so a
// session (and therefore an RLS-authorized business insert) may not exist
// until the user's first authenticated visit. Provision the business here,
// once a session is guaranteed to exist.
export async function ensureBusinessForUser(user: User) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("business_id")
    .eq("id", user.id)
    .single();

  if (profile?.business_id) {
    return profile.business_id;
  }

  const businessName =
    (user.user_metadata?.business_name as string | undefined) || "My Business";

  const { data: business, error } = await supabase
    .from("businesses")
    .insert({ name: businessName, owner_id: user.id })
    .select("id")
    .single();

  if (error || !business) {
    return null;
  }

  await supabase
    .from("profiles")
    .update({ business_id: business.id })
    .eq("id", user.id);

  return business.id;
}
