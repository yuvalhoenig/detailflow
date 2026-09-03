import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { UsersTable, type AdminUserRow } from "@/components/admin/users-table";

function isCurrentlyBanned(bannedUntil: string | undefined, now: number) {
  return Boolean(bannedUntil && new Date(bannedUntil).getTime() > now);
}

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const [{ data: authUsers }, { data: profiles }, { data: admins }, { data: businesses }] =
    await Promise.all([
      admin.auth.admin.listUsers({ perPage: 1000 }),
      supabase.from("profiles").select("id, business_id, role"),
      supabase.from("platform_admins").select("id"),
      supabase.from("businesses").select("id, name"),
    ]);

  const businessNameById = new Map((businesses ?? []).map((b) => [b.id, b.name]));
  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));
  const adminIds = new Set((admins ?? []).map((a) => a.id));
  // eslint-disable-next-line react-hooks/purity -- server component, evaluated once per request, not memoized
  const now = Date.now();

  const users: AdminUserRow[] = (authUsers?.users ?? []).map((u) => {
    const profile = profileById.get(u.id);
    return {
      id: u.id,
      email: u.email ?? "—",
      businessName: profile?.business_id
        ? (businessNameById.get(profile.business_id) ?? "—")
        : "—",
      role: profile?.role ?? "—",
      isPlatformAdmin: adminIds.has(u.id),
      isBanned: isCurrentlyBanned(u.banned_until, now),
      createdAt: u.created_at,
    };
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Users</h1>
      <p className="mt-1 text-sm text-muted">
        Manage every account on DetailFlow
      </p>

      <div className="mt-6">
        <UsersTable users={users} />
      </div>
    </div>
  );
}
