"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBusinessId } from "@/lib/supabase/current-business";
import { logActivity } from "@/lib/actions/activity";
import type { ActionState } from "@/lib/actions/customers";

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export async function createAppointment(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const businessId = await getCurrentBusinessId();
  if (!businessId) return { error: "No business found for this account." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const customerId = String(formData.get("customerId") ?? "");
  const vehicleId = String(formData.get("vehicleId") ?? "");
  const scheduledAt = String(formData.get("scheduledAt") ?? "");
  const durationMinutes = Number(formData.get("durationMinutes") ?? 60);
  const notes = String(formData.get("notes") ?? "").trim();

  if (!customerId) return { error: "Select a customer." };
  if (!scheduledAt) return { error: "Pick a date and time." };

  const { data: appointment, error } = await supabase
    .from("appointments")
    .insert({
      business_id: businessId,
      customer_id: customerId,
      vehicle_id: vehicleId || null,
      scheduled_at: new Date(scheduledAt).toISOString(),
      duration_minutes: durationMinutes,
      notes: notes || null,
    })
    .select("id")
    .single();

  if (error || !appointment) {
    return { error: error?.message ?? "Could not create appointment." };
  }

  await logActivity({
    businessId,
    actorId: user?.id ?? null,
    entityType: "appointment",
    entityId: appointment.id,
    action: "scheduled",
    metadata: {},
  });

  revalidatePath("/dashboard/appointments");
  revalidatePath(`/dashboard/customers/${customerId}`);
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus,
) {
  const supabase = await createClient();
  await supabase.from("appointments").update({ status }).eq("id", appointmentId);
  revalidatePath("/dashboard/appointments");
}

export async function deleteAppointment(appointmentId: string) {
  const supabase = await createClient();
  await supabase.from("appointments").delete().eq("id", appointmentId);
  revalidatePath("/dashboard/appointments");
}
