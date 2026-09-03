import Link from "next/link";
import { Building2, Users, CreditCard } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/dashboard/stat-card";
import { BusinessesTable, type AdminBusinessRow } from "@/components/admin/businesses-table";

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

  const businessRows: AdminBusinessRow[] = (businesses ?? []).map((b) => ({
    id: b.id,
    name: b.name,
    ownerEmail: emailByOwnerId.get(b.owner_id) ?? "—",
    plan: (planByBusiness.get(b.id) as "free" | "pro" | undefined) ?? "free",
    createdAt: b.created_at,
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Platform Admin</h1>
          <p className="mt-1 text-sm text-muted">
            Manage every business on DetailFlow
          </p>
        </div>
        <Link
          href="/admin/users"
          className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-background"
        >
          Manage Users
        </Link>
      </div>

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

      <div className="mt-6">
        <BusinessesTable businesses={businessRows} />
      </div>
    </div>
  );
}
