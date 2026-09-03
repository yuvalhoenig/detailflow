"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBusinessId } from "@/lib/supabase/current-business";
import type { ActionState } from "@/lib/actions/customers";

export async function recordPayment(
  invoiceId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const businessId = await getCurrentBusinessId();
  if (!businessId) return { error: "No business found for this account." };

  const supabase = await createClient();

  const amount = Number(formData.get("amount") ?? 0);
  const method = String(formData.get("method") ?? "card");

  if (!amount || amount <= 0) return { error: "Enter a valid amount." };

  const { data: invoice } = await supabase
    .from("invoices")
    .select("id, customer_id, total, amount_paid")
    .eq("id", invoiceId)
    .single();

  if (!invoice) return { error: "Invoice not found." };

  const { error } = await supabase.from("payments").insert({
    business_id: businessId,
    invoice_id: invoiceId,
    customer_id: invoice.customer_id,
    amount,
    method: method as "card" | "cash" | "check" | "other",
  });

  if (error) return { error: error.message };

  const newAmountPaid = Number(invoice.amount_paid) + amount;
  const newStatus = newAmountPaid >= Number(invoice.total) ? "paid" : undefined;

  await supabase
    .from("invoices")
    .update({
      amount_paid: newAmountPaid,
      ...(newStatus ? { status: newStatus } : {}),
    })
    .eq("id", invoiceId);

  revalidatePath(`/dashboard/invoices/${invoiceId}`);
  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard/payments");
}
