import { Bell, Search } from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { UserMenu } from "./user-menu";
import { createClient } from "@/lib/supabase/server";
import { isPlatformAdmin } from "@/lib/supabase/is-admin";

export async function Topbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const admin = await isPlatformAdmin();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-8">
      <div className="flex items-center gap-2">
        <MobileNav isAdmin={admin} />
        <div className="flex w-full max-w-md items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
          <Search className="h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search customers, jobs, invoices..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative rounded-full p-2 text-muted transition-colors hover:bg-background hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
        </button>
        {user?.email && <UserMenu email={user.email} />}
      </div>
    </header>
  );
}
