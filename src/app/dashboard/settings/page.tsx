import { createClient } from "@/lib/supabase/server";
import { getCurrentBusinessId } from "@/lib/supabase/current-business";
import { BusinessProfileForm } from "@/components/settings/business-profile-form";
import { ServicesManager } from "@/components/settings/services-manager";

export default async function SettingsPage() {
  const businessId = await getCurrentBusinessId();
  const supabase = await createClient();

  const [{ data: business }, { data: services }] = await Promise.all([
    businessId
      ? supabase
          .from("businesses")
          .select("name, phone, address")
          .eq("id", businessId)
          .single()
      : Promise.resolve({ data: null }),
    supabase
      .from("services")
      .select("id, name, description, price, duration_minutes, active")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
      <p className="mt-1 text-sm text-muted">Configure your business</p>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {business && <BusinessProfileForm business={business} />}
        <ServicesManager services={services ?? []} />
      </div>
    </div>
  );
}
