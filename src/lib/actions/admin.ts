"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { isPlatformAdmin } from "@/lib/supabase/is-admin";

async function requireAdmin() {
  const ok = await isPlatformAdmin();
  if (!ok) throw new Error("Not authorized.");
}

export async function setPlatformAdmin(userId: string, admin: boolean) {
  await requireAdmin();
  const supabase = await createClient();

  if (admin) {
    await supabase.from("platform_admins").insert({ id: userId });
  } else {
    await supabase.from("platform_admins").delete().eq("id", userId);
  }

  revalidatePath("/admin/users");
}

export async function banUser(userId: string, ban: boolean) {
  await requireAdmin();
  const admin = createAdminClient();

  await admin.auth.admin.updateUserById(userId, {
    ban_duration: ban ? "876000h" : "none",
  });

  revalidatePath("/admin/users");
}

export async function deleteUserAccount(userId: string) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.auth.admin.deleteUser(userId);
  revalidatePath("/admin/users");
}

export async function updateBusinessPlan(businessId: string, plan: "free" | "pro") {
  await requireAdmin();
  const supabase = await createClient();

  await supabase
    .from("subscriptions")
    .upsert(
      { business_id: businessId, plan, status: "active" },
      { onConflict: "business_id" },
    );

  revalidatePath("/admin");
}

export async function deleteBusiness(businessId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("businesses").delete().eq("id", businessId);
  revalidatePath("/admin");
}
