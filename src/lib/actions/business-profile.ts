"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBusinessId } from "@/lib/supabase/current-business";
import type { ActionState } from "@/lib/actions/customers";

export async function updateBusinessProfile(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const businessId = await getCurrentBusinessId();
  if (!businessId) return { error: "No business found for this account." };

  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  if (!name) return { error: "Business name is required." };

  const { error } = await supabase
    .from("businesses")
    .update({ name, phone: phone || null, address: address || null })
    .eq("id", businessId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/settings");
}
