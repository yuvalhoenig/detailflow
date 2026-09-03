import { createClient } from "@/lib/supabase/server";
import { getCustomersWithVehicles } from "@/lib/supabase/customers-with-vehicles";
import { AddQuoteDialog } from "@/components/quotes/add-quote-dialog";
import { QuotesTable, type QuoteRow } from "@/components/quotes/quotes-table";

export default async function QuotesPage() {
  const supabase = await createClient();

  const [{ data: quotes }, { data: services }, customers] = await Promise.all([
    supabase
      .from("quotes")
      .select("id, customer_id, total, status, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("services")
      .select("id, name, price")
      .eq("active", true)
      .order("name", { ascending: true }),
    getCustomersWithVehicles(),
  ]);

  const customerNameById = new Map(customers.map((c) => [c.id, c.name]));

  const rows: QuoteRow[] = (quotes ?? []).map((q) => ({
    id: q.id,
    customerId: q.customer_id,
    customerName: customerNameById.get(q.customer_id) ?? "Unknown",
    total: Number(q.total),
    status: q.status,
    createdAt: q.created_at,
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Quotes</h1>
          <p className="mt-1 text-sm text-muted">
            Send and manage customer quotes
          </p>
        </div>
        <AddQuoteDialog customers={customers} services={services ?? []} />
      </div>

      <div className="mt-6">
        <QuotesTable quotes={rows} />
      </div>
    </div>
  );
}
