import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, FileCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatusSelectForm } from "@/components/shared/status-select-form";
import {
  updateQuoteStatus,
  deleteQuote,
  convertQuoteToInvoice,
  type QuoteStatus,
} from "@/lib/actions/quotes";

const STATUSES: QuoteStatus[] = ["draft", "sent", "accepted", "declined", "expired"];

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: quote } = await supabase.from("quotes").select("*").eq("id", id).single();
  if (!quote) notFound();

  const [{ data: customer }, { data: items }] = await Promise.all([
    supabase
      .from("customers")
      .select("id, first_name, last_name")
      .eq("id", quote.customer_id)
      .single(),
    supabase
      .from("quote_items")
      .select("id, description, quantity, unit_price")
      .eq("quote_id", id),
  ]);

  return (
    <div>
      <Link
        href="/dashboard/quotes"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to quotes
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-foreground">
              Quote for{" "}
              <Link
                href={`/dashboard/customers/${customer?.id}`}
                className="hover:text-primary"
              >
                {customer?.first_name} {customer?.last_name}
              </Link>
            </h1>
            <StatusBadge status={quote.status} />
          </div>
          {quote.valid_until && (
            <p className="mt-1 text-sm text-muted">
              Valid until {new Date(quote.valid_until).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <StatusSelectForm
            currentStatus={quote.status}
            statuses={STATUSES}
            action={async (formData) => {
              "use server";
              await updateQuoteStatus(id, formData.get("status") as QuoteStatus);
            }}
          />

          {quote.status !== "accepted" && (
            <form
              action={async () => {
                "use server";
                await convertQuoteToInvoice(id);
              }}
            >
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <FileCheck className="h-4 w-4" />
                Convert to Invoice
              </button>
            </form>
          )}

          <form
            action={async () => {
              "use server";
              await deleteQuote(id);
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

      {quote.notes && (
        <p className="mt-4 rounded-lg border border-border bg-card p-4 text-sm text-muted">
          {quote.notes}
        </p>
      )}

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
            <span>${Number(quote.subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Tax</span>
            <span>${Number(quote.tax).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-foreground">
            <span>Total</span>
            <span>${Number(quote.total).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
