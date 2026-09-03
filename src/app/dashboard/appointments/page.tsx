import { createClient } from "@/lib/supabase/server";
import { getCustomersWithVehicles } from "@/lib/supabase/customers-with-vehicles";
import { AddAppointmentDialog } from "@/components/appointments/add-appointment-dialog";
import {
  AppointmentsTable,
  type AppointmentRow,
} from "@/components/appointments/appointments-table";

export default async function AppointmentsPage() {
  const supabase = await createClient();

  const [{ data: appointments }, customers] = await Promise.all([
    supabase
      .from("appointments")
      .select(
        "id, scheduled_at, duration_minutes, status, customer_id, vehicle_id",
      )
      .order("scheduled_at", { ascending: true }),
    getCustomersWithVehicles(),
  ]);

  const customerNameById = new Map(customers.map((c) => [c.id, c.name]));
  const vehicleLabelById = new Map(
    customers.flatMap((c) => c.vehicles.map((v) => [v.id, v.label] as const)),
  );

  const rows: AppointmentRow[] = (appointments ?? []).map((a) => ({
    id: a.id,
    scheduledAt: a.scheduled_at,
    durationMinutes: a.duration_minutes,
    status: a.status,
    customerId: a.customer_id,
    customerName: customerNameById.get(a.customer_id) ?? "Unknown",
    vehicleLabel: a.vehicle_id ? (vehicleLabelById.get(a.vehicle_id) ?? null) : null,
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Appointments</h1>
          <p className="mt-1 text-sm text-muted">
            Schedule and track appointments
          </p>
        </div>
        <AddAppointmentDialog customers={customers} />
      </div>

      <div className="mt-6">
        <AppointmentsTable appointments={rows} />
      </div>
    </div>
  );
}
