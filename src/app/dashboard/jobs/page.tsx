import { createClient } from "@/lib/supabase/server";
import { getCustomersWithVehicles } from "@/lib/supabase/customers-with-vehicles";
import { AddJobDialog } from "@/components/jobs/add-job-dialog";
import { JobsTable, type JobRow } from "@/components/jobs/jobs-table";

export default async function JobsPage() {
  const supabase = await createClient();

  const [{ data: jobs }, { data: services }, customers] = await Promise.all([
    supabase
      .from("jobs")
      .select("id, customer_id, vehicle_id, total, status, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("services")
      .select("id, name, price")
      .eq("active", true)
      .order("name", { ascending: true }),
    getCustomersWithVehicles(),
  ]);

  const customerNameById = new Map(customers.map((c) => [c.id, c.name]));
  const vehicleLabelById = new Map(
    customers.flatMap((c) => c.vehicles.map((v) => [v.id, v.label] as const)),
  );

  const rows: JobRow[] = (jobs ?? []).map((j) => ({
    id: j.id,
    customerId: j.customer_id,
    customerName: customerNameById.get(j.customer_id) ?? "Unknown",
    vehicleLabel: j.vehicle_id ? (vehicleLabelById.get(j.vehicle_id) ?? null) : null,
    total: Number(j.total),
    status: j.status,
    createdAt: j.created_at,
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Jobs</h1>
          <p className="mt-1 text-sm text-muted">
            Track detailing jobs in progress
          </p>
        </div>
        <AddJobDialog customers={customers} services={services ?? []} />
      </div>

      <div className="mt-6">
        <JobsTable jobs={rows} />
      </div>
    </div>
  );
}
