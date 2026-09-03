import { Building2, Users, CreditCard } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/dashboard/stat-card";

export default async function AdminPage() {
  const supabase = await createClient();

  const [
    { data: businesses },
    { count: userCount },
    { data: subscriptions },
    { data: owners },
  ] = await Promise.all([
    supabase
      .from("businesses")
      .select("id, name, owner_id, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("subscriptions").select("business_id, plan, status"),
    supabase.from("profiles").select("id, email"),
  ]);

  const emailByOwnerId = new Map((owners ?? []).map((o) => [o.id, o.email]));
  const planByBusiness = new Map(
    (subscriptions ?? []).map((s) => [s.business_id, s.plan]),
  );
  const proCount = (subscriptions ?? []).filter((s) => s.plan === "pro").length;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Platform Admin</h1>
      <p className="mt-1 text-sm text-muted">
        Manage every business on DetailFlow
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Businesses" value={String(businesses?.length ?? 0)} icon={Building2} />
        <StatCard
          label="Total Users"
          value={String(userCount ?? 0)}
          icon={Users}
          accent="secondary"
        />
        <StatCard label="Pro Subscriptions" value={String(proCount)} icon={CreditCard} />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Business</th>
              <th className="px-4 py-3 font-medium">Owner</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {(businesses ?? []).length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted">
                  No businesses yet.
                </td>
              </tr>
            ) : (
              (businesses ?? []).map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">{b.name}</td>
                  <td className="px-4 py-3 text-muted">
                    {emailByOwnerId.get(b.owner_id) ?? "—"}
                  </td>
                  <td className="px-4 py-3 capitalize text-muted">
                    {planByBusiness.get(b.id) ?? "free"}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(b.created_at).toLocaleDateString()}
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
