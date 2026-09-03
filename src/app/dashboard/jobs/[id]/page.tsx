import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/shared/status-badge";
import { deleteJob } from "@/lib/actions/jobs";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: job } = await supabase.from("jobs").select("*").eq("id", id).single();
  if (!job) notFound();

  const [{ data: customer }, { data: vehicle }, { data: lineItems }] = await Promise.all([
    supabase
      .from("customers")
      .select("id, first_name, last_name")
      .eq("id", job.customer_id)
      .single(),
    job.vehicle_id
      ? supabase
          .from("vehicles")
          .select("make, model, year")
          .eq("id", job.vehicle_id)
          .single()
      : Promise.resolve({ data: null }),
    supabase.from("job_services").select("id, description, quantity, unit_price").eq("job_id", id),
  ]);

  return (
    <div>
      <Link
        href="/dashboard/jobs"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to jobs
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-foreground">
              Job for{" "}
              <Link
                href={`/dashboard/customers/${customer?.id}`}
                className="hover:text-primary"
              >
                {customer?.first_name} {customer?.last_name}
              </Link>
            </h1>
            <StatusBadge status={job.status} />
          </div>
          {vehicle && (
            <p className="mt-1 text-sm text-muted">
              {[vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(" ")}
            </p>
          )}
        </div>
        <form
          action={async () => {
            "use server";
            await deleteJob(id);
          }}
        >
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg border border-danger/30 px-3 py-2 text-sm font-medium text-danger hover:bg-danger/10"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </form>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Services</h2>
        <div className="mt-3 space-y-2">
          {(lineItems ?? []).map((li) => (
            <div key={li.id} className="flex justify-between text-sm">
              <span className="text-foreground">
                {li.description} × {li.quantity}
              </span>
              <span className="text-muted">
                ${(Number(li.unit_price) * li.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-border pt-3 text-sm font-semibold text-foreground">
          <span>Total</span>
          <span>${Number(job.total).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
