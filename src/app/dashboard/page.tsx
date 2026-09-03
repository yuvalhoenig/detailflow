import Link from "next/link";
import { Users, CalendarDays, Receipt, DollarSign } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    { count: customerCount },
    { data: customers },
    { data: upcomingAppointments },
    { data: outstandingInvoices },
    { data: recentPayments },
  ] = await Promise.all([
    supabase.from("customers").select("id", { count: "exact", head: true }),
    supabase.from("customers").select("id, first_name, last_name"),
    supabase
      .from("appointments")
      .select("id, scheduled_at, status, customer_id")
      .gte("scheduled_at", now.toISOString())
      .not("status", "in", "(cancelled,completed,no_show)")
      .order("scheduled_at", { ascending: true })
      .limit(5),
    supabase
      .from("invoices")
      .select("id, total, amount_paid")
      .in("status", ["sent", "overdue"]),
    supabase
      .from("payments")
      .select("amount")
      .gte("paid_at", thirtyDaysAgo.toISOString()),
  ]);

  const customerNameById = new Map(
    (customers ?? []).map((c) => [c.id, `${c.first_name} ${c.last_name ?? ""}`.trim()]),
  );

  const outstandingTotal = (outstandingInvoices ?? []).reduce(
    (sum, inv) => sum + (Number(inv.total) - Number(inv.amount_paid)),
    0,
  );
  const revenue30d = (recentPayments ?? []).reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">
        Overview of your detailing business
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Customers" value={String(customerCount ?? 0)} icon={Users} />
        <StatCard
          label="Upcoming Appointments"
          value={String(upcomingAppointments?.length ?? 0)}
          icon={CalendarDays}
          accent="secondary"
        />
        <StatCard
          label="Outstanding Invoices"
          value={`$${outstandingTotal.toFixed(2)}`}
          icon={Receipt}
        />
        <StatCard
          label="Revenue (30d)"
          value={`$${revenue30d.toFixed(2)}`}
          icon={DollarSign}
          accent="secondary"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">
          Upcoming Appointments
        </h2>
        <div className="mt-4 space-y-2">
          {(upcomingAppointments ?? []).length === 0 ? (
            <p className="text-sm text-muted">Nothing scheduled yet.</p>
          ) : (
            (upcomingAppointments ?? []).map((a) => (
              <Link
                key={a.id}
                href={`/dashboard/customers/${a.customer_id}`}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm hover:bg-background"
              >
                <span className="text-foreground">
                  {customerNameById.get(a.customer_id) ?? "Unknown"}
                </span>
                <span className="text-muted">
                  {new Date(a.scheduled_at).toLocaleString()}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
