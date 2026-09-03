"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBusinessId } from "@/lib/supabase/current-business";
import type { ActionState } from "@/lib/actions/customers";

export async function createVehicle(
  customerId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const businessId = await getCurrentBusinessId();
  if (!businessId) return { error: "No business found for this account." };

  const supabase = await createClient();

  const make = String(formData.get("make") ?? "").trim();
  const model = String(formData.get("model") ?? "").trim();
  const yearRaw = String(formData.get("year") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim();
  const licensePlate = String(formData.get("licensePlate") ?? "").trim();

  if (!make && !model) {
    return { error: "Enter at least a make or model." };
  }

  const { error } = await supabase.from("vehicles").insert({
    business_id: businessId,
    customer_id: customerId,
    make: make || null,
    model: model || null,
    year: yearRaw ? Number(yearRaw) : null,
    color: color || null,
    license_plate: licensePlate || null,
  });

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/customers/${customerId}`);
}

export async function deleteVehicle(customerId: string, vehicleId: string) {
  const supabase = await createClient();
  await supabase.from("vehicles").delete().eq("id", vehicleId);
  revalidatePath(`/dashboard/customers/${customerId}`);
}
