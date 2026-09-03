"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBusinessId } from "@/lib/supabase/current-business";
import type { ActionState } from "@/lib/actions/customers";

export async function createCustomerNote(
  customerId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const businessId = await getCurrentBusinessId();
  if (!businessId) return { error: "No business found for this account." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: "Note cannot be empty." };

  const { error } = await supabase.from("customer_notes").insert({
    business_id: businessId,
    customer_id: customerId,
    author_id: user?.id ?? null,
    body,
  });

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/customers/${customerId}`);
}
