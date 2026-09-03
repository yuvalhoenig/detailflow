"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBusinessId } from "@/lib/supabase/current-business";
import { logActivity } from "@/lib/actions/activity";
import type { ActionState } from "@/lib/actions/customers";

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "void";

export async function createInvoice(
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
  const dueDate = String(formData.get("dueDate") ?? "");
  const serviceIds = formData.getAll("serviceIds").map(String).filter(Boolean);

  if (!customerId) return { error: "Select a customer." };
  if (serviceIds.length === 0) return { error: "Select at least one service." };

  const { data: services } = await supabase
    .from("services")
    .select("id, name, price")
    .in("id", serviceIds);

  const subtotal = (services ?? []).reduce((sum, s) => sum + Number(s.price), 0);

  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert({
      business_id: businessId,
      customer_id: customerId,
      subtotal,
      total: subtotal,
      due_date: dueDate || null,
      status: "sent",
    })
    .select("id")
    .single();

  if (error || !invoice) return { error: error?.message ?? "Could not create invoice." };

  await supabase.from("invoice_items").insert(
    (services ?? []).map((s) => ({
      invoice_id: invoice.id,
      description: s.name,
      unit_price: s.price,
      quantity: 1,
    })),
  );

  await logActivity({
    businessId,
    actorId: user?.id ?? null,
    entityType: "invoice",
    entityId: invoice.id,
    action: "created",
    metadata: {},
  });

  revalidatePath("/dashboard/invoices");
  redirect(`/dashboard/invoices/${invoice.id}`);
}

export async function updateInvoiceStatus(invoiceId: string, status: InvoiceStatus) {
  const supabase = await createClient();
  await supabase.from("invoices").update({ status }).eq("id", invoiceId);
  revalidatePath("/dashboard/invoices");
  revalidatePath(`/dashboard/invoices/${invoiceId}`);
}

export async function deleteInvoice(invoiceId: string) {
  const supabase = await createClient();
  await supabase.from("invoices").delete().eq("id", invoiceId);
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}
