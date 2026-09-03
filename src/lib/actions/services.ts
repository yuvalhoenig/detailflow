"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBusinessId } from "@/lib/supabase/current-business";
import type { ActionState } from "@/lib/actions/customers";

export async function createService(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const businessId = await getCurrentBusinessId();
  if (!businessId) return { error: "No business found for this account." };

  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const durationMinutes = Number(formData.get("durationMinutes") ?? 60);

  if (!name) return { error: "Service name is required." };

  const { error } = await supabase.from("services").insert({
    business_id: businessId,
    name,
    description: description || null,
    price,
    duration_minutes: durationMinutes,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/settings");
}

export async function updateService(
  serviceId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const durationMinutes = Number(formData.get("durationMinutes") ?? 60);

  if (!name) return { error: "Service name is required." };

  const { error } = await supabase
    .from("services")
    .update({
      name,
      description: description || null,
      price,
      duration_minutes: durationMinutes,
    })
    .eq("id", serviceId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/settings");
}

export async function toggleServiceActive(serviceId: string, active: boolean) {
  const supabase = await createClient();
  await supabase.from("services").update({ active }).eq("id", serviceId);
  revalidatePath("/dashboard/settings");
}

export async function deleteService(serviceId: string) {
  const supabase = await createClient();
  await supabase.from("services").delete().eq("id", serviceId);
  revalidatePath("/dashboard/settings");
}
