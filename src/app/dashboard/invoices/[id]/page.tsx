import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatusSelectForm } from "@/components/shared/status-select-form";
import { RecordPaymentForm } from "@/components/invoices/record-payment-form";
import {
  updateInvoiceStatus,
  deleteInvoice,
  type InvoiceStatus,
} from "@/lib/actions/invoices";

const STATUSES: InvoiceStatus[] = ["draft", "sent", "paid", "overdue", "void"];

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: invoice } = await supabase.from("invoices").select("*").eq("id", id).single();
  if (!invoice) notFound();

  const [{ data: customer }, { data: items }, { data: payments }] = await Promise.all([
    supabase
      .from("customers")
      .select("id, first_name, last_name")
      .eq("id", invoice.customer_id)
      .single(),
    supabase
      .from("invoice_items")
      .select("id, description, quantity, unit_price")
      .eq("invoice_id", id),
    supabase
      .from("payments")
      .select("id, amount, method, paid_at")
      .eq("invoice_id", id)
      .order("paid_at", { ascending: false }),
  ]);

  const balanceDue = Number(invoice.total) - Number(invoice.amount_paid);

  return (
    <div>
      <Link
        href="/dashboard/invoices"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to invoices
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-foreground">
              Invoice for{" "}
              <Link
                href={`/dashboard/customers/${customer?.id}`}
                className="hover:text-primary"
              >
                {customer?.first_name} {customer?.last_name}
              </Link>
            </h1>
            <StatusBadge status={invoice.status} />
          </div>
          {invoice.due_date && (
            <p className="mt-1 text-sm text-muted">
              Due {new Date(invoice.due_date).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <StatusSelectForm
            currentStatus={invoice.status}
            statuses={STATUSES}
            action={async (formData) => {
              "use server";
              await updateInvoiceStatus(id, formData.get("status") as InvoiceStatus);
            }}
          />

          <form
            action={async () => {
              "use server";
              await deleteInvoice(id);
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg border border-danger/30 px-3 py-2 text-sm font-medium text-danger hover:bg-danger/10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Line Items</h2>
        <div className="mt-3 space-y-2">
          {(items ?? []).map((li) => (
            <div key={li.id} className="flex justify-between text-sm">
              <span className="text-foreground">
                {li.description} × {li.quantity}
              </span>
              <span className="text-muted">
                ${(Number(li.unit_price) * li.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1 border-t border-border pt-3 text-sm">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span>${Number(invoice.subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Tax</span>
            <span>${Number(invoice.tax).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-foreground">
            <span>Total</span>
            <span>${Number(invoice.total).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Paid</span>
            <span>${Number(invoice.amount_paid).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-foreground">
            <span>Balance Due</span>
            <span>${balanceDue.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Payments</h2>
        <div className="mt-3">
          <RecordPaymentForm invoiceId={id} balanceDue={balanceDue} />
        </div>
        <div className="mt-4 space-y-2">
          {(payments ?? []).length === 0 ? (
            <p className="text-sm text-muted">No payments recorded yet.</p>
          ) : (
            (payments ?? []).map((p) => (
              <div key={p.id} className="flex justify-between text-sm">
                <span className="capitalize text-foreground">{p.method}</span>
                <span className="text-muted">
                  ${Number(p.amount).toFixed(2)} ·{" "}
                  {new Date(p.paid_at).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
