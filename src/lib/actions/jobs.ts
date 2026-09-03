"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBusinessId } from "@/lib/supabase/current-business";
import { logActivity } from "@/lib/actions/activity";
import type { ActionState } from "@/lib/actions/customers";

export type JobStatus = "pending" | "in_progress" | "completed" | "cancelled";

export async function createJob(
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
  const serviceIds = formData.getAll("serviceIds").map(String).filter(Boolean);

  if (!customerId) return { error: "Select a customer." };
  if (serviceIds.length === 0) return { error: "Select at least one service." };

  const { data: services } = await supabase
    .from("services")
    .select("id, name, price")
    .in("id", serviceIds);

  const total = (services ?? []).reduce((sum, s) => sum + Number(s.price), 0);

  const { data: job, error } = await supabase
    .from("jobs")
    .insert({
      business_id: businessId,
      customer_id: customerId,
      vehicle_id: vehicleId || null,
      total,
    })
    .select("id")
    .single();

  if (error || !job) return { error: error?.message ?? "Could not create job." };

  const lineItems = (services ?? []).map((s) => ({
    job_id: job.id,
    service_id: s.id,
    description: s.name,
    unit_price: s.price,
    quantity: 1,
  }));
  await supabase.from("job_services").insert(lineItems);

  await logActivity({
    businessId,
    actorId: user?.id ?? null,
    entityType: "job",
    entityId: job.id,
    action: "created",
    metadata: {},
  });

  revalidatePath("/dashboard/jobs");
  redirect(`/dashboard/jobs/${job.id}`);
}

export async function updateJobStatus(jobId: string, status: JobStatus) {
  const supabase = await createClient();
  const updates = {
    status,
    started_at: status === "in_progress" ? new Date().toISOString() : undefined,
    completed_at: status === "completed" ? new Date().toISOString() : undefined,
  };

  await supabase.from("jobs").update(updates).eq("id", jobId);
  revalidatePath("/dashboard/jobs");
  revalidatePath(`/dashboard/jobs/${jobId}`);
}

export async function deleteJob(jobId: string) {
  const supabase = await createClient();
  await supabase.from("jobs").delete().eq("id", jobId);
  revalidatePath("/dashboard/jobs");
  redirect("/dashboard/jobs");
}
