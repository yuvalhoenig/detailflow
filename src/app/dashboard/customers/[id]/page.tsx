import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { EditCustomerDialog } from "@/components/customers/edit-customer-dialog";
import { VehiclesSection } from "@/components/customers/vehicles-section";
import { NotesSection } from "@/components/customers/notes-section";
import { ActivityTimeline } from "@/components/customers/activity-timeline";
import { UpcomingAppointments } from "@/components/customers/upcoming-appointments";
import { CustomerStats } from "@/components/customers/customer-stats";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (!customer) notFound();

  const [
    { data: vehicles },
    { data: notes },
    { data: activity },
    { data: appointments },
    { data: payments },
    { data: invoices },
    { count: appointmentCount },
  ] = await Promise.all([
    supabase
      .from("vehicles")
      .select("id, make, model, year, color, license_plate")
      .eq("customer_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("customer_notes")
      .select("id, body, created_at")
      .eq("customer_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("activity")
      .select("id, action, entity_type, metadata, created_at")
      .eq("entity_id", id)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("appointments")
      .select("id, scheduled_at, status")
      .eq("customer_id", id)
      .gte("scheduled_at", new Date().toISOString())
      .order("scheduled_at", { ascending: true })
      .limit(5),
    supabase.from("payments").select("amount").eq("customer_id", id),
    supabase.from("invoices").select("total, amount_paid").eq("customer_id", id),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("customer_id", id),
  ]);

  const totalSpent = (payments ?? []).reduce((sum, p) => sum + Number(p.amount), 0);
  const outstandingBalance = (invoices ?? []).reduce(
    (sum, inv) => sum + (Number(inv.total) - Number(inv.amount_paid)),
    0,
  );
  const avgJobValue =
    invoices && invoices.length > 0
      ? invoices.reduce((sum, inv) => sum + Number(inv.total), 0) / invoices.length
      : 0;

  return (
    <div>
      <Link
        href="/dashboard/customers"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to customers
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {customer.first_name} {customer.last_name}
          </h1>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
            {customer.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" /> {customer.email}
              </span>
            )}
            {customer.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-4 w-4" /> {customer.phone}
              </span>
            )}
            {customer.address && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {customer.address}
              </span>
            )}
          </div>
        </div>
        <EditCustomerDialog customer={customer} />
      </div>

      <div className="mt-6">
        <CustomerStats
          totalSpent={totalSpent}
          appointmentCount={appointmentCount ?? 0}
          avgJobValue={avgJobValue}
          outstandingBalance={outstandingBalance}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <VehiclesSection customerId={id} vehicles={vehicles ?? []} />
        <UpcomingAppointments appointments={appointments ?? []} />
        <NotesSection customerId={id} notes={notes ?? []} />
        <ActivityTimeline entries={activity ?? []} />
      </div>
    </div>
  );
}
