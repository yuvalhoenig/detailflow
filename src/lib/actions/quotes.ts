"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBusinessId } from "@/lib/supabase/current-business";
import { logActivity } from "@/lib/actions/activity";
import type { ActionState } from "@/lib/actions/customers";

export type QuoteStatus = "draft" | "sent" | "accepted" | "declined" | "expired";

export async function createQuote(
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
  const notes = String(formData.get("notes") ?? "").trim();
  const validUntil = String(formData.get("validUntil") ?? "");
  const serviceIds = formData.getAll("serviceIds").map(String).filter(Boolean);

  if (!customerId) return { error: "Select a customer." };
  if (serviceIds.length === 0) return { error: "Select at least one service." };

  const { data: services } = await supabase
    .from("services")
    .select("id, name, price")
    .in("id", serviceIds);

  const subtotal = (services ?? []).reduce((sum, s) => sum + Number(s.price), 0);

  const { data: quote, error } = await supabase
    .from("quotes")
    .insert({
      business_id: businessId,
      customer_id: customerId,
      vehicle_id: vehicleId || null,
      subtotal,
      total: subtotal,
      notes: notes || null,
      valid_until: validUntil || null,
    })
    .select("id")
    .single();

  if (error || !quote) return { error: error?.message ?? "Could not create quote." };

  await supabase.from("quote_items").insert(
    (services ?? []).map((s) => ({
      quote_id: quote.id,
      service_id: s.id,
      description: s.name,
      unit_price: s.price,
      quantity: 1,
    })),
  );

  await logActivity({
    businessId,
    actorId: user?.id ?? null,
    entityType: "quote",
    entityId: quote.id,
    action: "created",
    metadata: {},
  });

  revalidatePath("/dashboard/quotes");
  redirect(`/dashboard/quotes/${quote.id}`);
}

export async function updateQuoteStatus(quoteId: string, status: QuoteStatus) {
  const supabase = await createClient();
  await supabase.from("quotes").update({ status }).eq("id", quoteId);
  revalidatePath("/dashboard/quotes");
  revalidatePath(`/dashboard/quotes/${quoteId}`);
}

export async function deleteQuote(quoteId: string) {
  const supabase = await createClient();
  await supabase.from("quotes").delete().eq("id", quoteId);
  revalidatePath("/dashboard/quotes");
  redirect("/dashboard/quotes");
}

export async function convertQuoteToInvoice(quoteId: string) {
  const businessId = await getCurrentBusinessId();
  if (!businessId) return;

  const supabase = await createClient();

  const { data: quote } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", quoteId)
    .single();
  if (!quote) return;

  const { data: items } = await supabase
    .from("quote_items")
    .select("description, quantity, unit_price")
    .eq("quote_id", quoteId);

  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert({
      business_id: businessId,
      customer_id: quote.customer_id,
      quote_id: quote.id,
      subtotal: quote.subtotal,
      tax: quote.tax,
      total: quote.total,
      due_date: null,
    })
    .select("id")
    .single();

  if (error || !invoice) return;

  await supabase.from("invoice_items").insert(
    (items ?? []).map((i) => ({
      invoice_id: invoice.id,
      description: i.description,
      quantity: i.quantity,
      unit_price: i.unit_price,
    })),
  );

  await updateQuoteStatus(quoteId, "accepted");
  revalidatePath("/dashboard/invoices");
  redirect(`/dashboard/invoices/${invoice.id}`);
}
