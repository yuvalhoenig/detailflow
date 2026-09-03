import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function PaymentsPage() {
  const supabase = await createClient();

  const [{ data: payments }, { data: customers }] = await Promise.all([
    supabase
      .from("payments")
      .select("id, amount, method, invoice_id, customer_id, paid_at")
      .order("paid_at", { ascending: false }),
    supabase.from("customers").select("id, first_name, last_name"),
  ]);

  const customerNameById = new Map(
    (customers ?? []).map((c) => [c.id, `${c.first_name} ${c.last_name ?? ""}`.trim()]),
  );

  const total = (payments ?? []).reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Payments</h1>
      <p className="mt-1 text-sm text-muted">Track payments and balances</p>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <p className="text-sm font-medium text-muted">Total Collected</p>
        <p className="mt-1 text-2xl font-semibold text-foreground">
          ${total.toFixed(2)}
        </p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Method</th>
              <th className="px-4 py-3 font-medium">Invoice</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {(payments ?? []).length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  No payments recorded yet.
                </td>
              </tr>
            ) : (
              (payments ?? []).map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {customerNameById.get(p.customer_id) ?? "Unknown"}
                  </td>
                  <td className="px-4 py-3 text-muted">${Number(p.amount).toFixed(2)}</td>
                  <td className="px-4 py-3 capitalize text-muted">{p.method}</td>
                  <td className="px-4 py-3">
                    {p.invoice_id ? (
                      <Link
                        href={`/dashboard/invoices/${p.invoice_id}`}
                        className="text-primary hover:underline"
                      >
                        View
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(p.paid_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
