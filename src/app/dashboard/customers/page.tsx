import { createClient } from "@/lib/supabase/server";
import { AddCustomerDialog } from "@/components/customers/add-customer-dialog";
import { CustomersTable, type CustomerRow } from "@/components/customers/customers-table";

export default async function CustomersPage() {
  const supabase = await createClient();

  const [{ data: customersData }, { data: vehiclesData }] = await Promise.all([
    supabase
      .from("customers")
      .select("id, first_name, last_name, email, phone, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("vehicles").select("customer_id"),
  ]);

  const vehicleCounts = new Map<string, number>();
  for (const v of vehiclesData ?? []) {
    vehicleCounts.set(v.customer_id, (vehicleCounts.get(v.customer_id) ?? 0) + 1);
  }

  const customers: CustomerRow[] = (customersData ?? []).map((c) => ({
    ...c,
    vehicle_count: vehicleCounts.get(c.id) ?? 0,
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Customers</h1>
          <p className="mt-1 text-sm text-muted">
            Manage your customer relationships
          </p>
        </div>
        <AddCustomerDialog />
      </div>

      <div className="mt-6">
        <CustomersTable customers={customers} />
      </div>
    </div>
  );
}
