import "server-only";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentBusinessId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("business_id")
    .eq("id", user.id)
    .single();

  return profile?.business_id ?? null;
}
