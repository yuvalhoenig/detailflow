import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { CustomerOption } from "@/components/shared/customer-vehicle-select";

export async function getCustomersWithVehicles(): Promise<CustomerOption[]> {
  const supabase = await createClient();

  const [{ data: customers }, { data: vehicles }] = await Promise.all([
    supabase
      .from("customers")
      .select("id, first_name, last_name")
      .order("first_name", { ascending: true }),
    supabase.from("vehicles").select("id, customer_id, make, model, year"),
  ]);

  return (customers ?? []).map((c) => ({
    id: c.id,
    name: `${c.first_name} ${c.last_name ?? ""}`.trim(),
    vehicles: (vehicles ?? [])
      .filter((v) => v.customer_id === c.id)
      .map((v) => ({
        id: v.id,
        label: [v.year, v.make, v.model].filter(Boolean).join(" ") || "Vehicle",
      })),
  }));
}
