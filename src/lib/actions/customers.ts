"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBusinessId } from "@/lib/supabase/current-business";
import { logActivity } from "@/lib/actions/activity";

export type ActionState = { error: string } | undefined;

export async function createCustomer(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const businessId = await getCurrentBusinessId();
  if (!businessId) return { error: "No business found for this account." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  if (!firstName) return { error: "First name is required." };

  const { data: customer, error } = await supabase
    .from("customers")
    .insert({
      business_id: businessId,
      first_name: firstName,
      last_name: lastName || null,
      email: email || null,
      phone: phone || null,
      address: address || null,
    })
    .select("id")
    .single();

  if (error || !customer) {
    return { error: error?.message ?? "Could not create customer." };
  }

  await logActivity({
    businessId,
    actorId: user?.id ?? null,
    entityType: "customer",
    entityId: customer.id,
    action: "created",
    metadata: { name: `${firstName} ${lastName}`.trim() },
  });

  revalidatePath("/dashboard/customers");
  redirect(`/dashboard/customers/${customer.id}`);
}

export async function updateCustomer(
  customerId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  if (!firstName) return { error: "First name is required." };

  const { error } = await supabase
    .from("customers")
    .update({
      first_name: firstName,
      last_name: lastName || null,
      email: email || null,
      phone: phone || null,
      address: address || null,
    })
    .eq("id", customerId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/customers");
  revalidatePath(`/dashboard/customers/${customerId}`);
  redirect(`/dashboard/customers/${customerId}`);
}

export async function deleteCustomer(customerId: string) {
  const supabase = await createClient();
  await supabase.from("customers").delete().eq("id", customerId);
  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}
