import { createClient } from "@/lib/supabase/server";
import { getCustomersWithVehicles } from "@/lib/supabase/customers-with-vehicles";
import { AddInvoiceDialog } from "@/components/invoices/add-invoice-dialog";
import { InvoicesTable, type InvoiceRow } from "@/components/invoices/invoices-table";

export default async function InvoicesPage() {
  const supabase = await createClient();

  const [{ data: invoices }, { data: services }, customers] = await Promise.all([
    supabase
      .from("invoices")
      .select("id, customer_id, total, amount_paid, status, due_date")
      .order("created_at", { ascending: false }),
    supabase
      .from("services")
      .select("id, name, price")
      .eq("active", true)
      .order("name", { ascending: true }),
    getCustomersWithVehicles(),
  ]);

  const customerNameById = new Map(customers.map((c) => [c.id, c.name]));

  const rows: InvoiceRow[] = (invoices ?? []).map((inv) => ({
    id: inv.id,
    customerId: inv.customer_id,
    customerName: customerNameById.get(inv.customer_id) ?? "Unknown",
    total: Number(inv.total),
    amountPaid: Number(inv.amount_paid),
    status: inv.status,
    dueDate: inv.due_date,
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Invoices</h1>
          <p className="mt-1 text-sm text-muted">Bill your customers</p>
        </div>
        <AddInvoiceDialog customers={customers} services={services ?? []} />
      </div>

      <div className="mt-6">
        <InvoicesTable invoices={rows} />
      </div>
    </div>
  );
}
