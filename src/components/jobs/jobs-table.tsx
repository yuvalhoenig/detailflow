"use client";

import Link from "next/link";
import { updateJobStatus, type JobStatus } from "@/lib/actions/jobs";

export type JobRow = {
  id: string;
  customerId: string;
  customerName: string;
  vehicleLabel: string | null;
  total: number;
  status: JobStatus;
  createdAt: string;
};

const STATUSES: JobStatus[] = ["pending", "in_progress", "completed", "cancelled"];

export function JobsTable({ jobs }: { jobs: JobRow[] }) {
  if (jobs.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-border bg-card text-sm text-muted shadow-sm">
        No jobs yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Vehicle</th>
            <th className="px-4 py-3 font-medium">Total</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Created</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3">
                <Link
                  href={`/dashboard/jobs/${j.id}`}
                  className="font-medium text-foreground hover:text-primary"
                >
                  {j.customerName}
                </Link>
              </td>
              <td className="px-4 py-3 text-muted">{j.vehicleLabel ?? "—"}</td>
              <td className="px-4 py-3 text-muted">${j.total.toFixed(2)}</td>
              <td className="px-4 py-3">
                <select
                  value={j.status}
                  onChange={(e) => updateJobStatus(j.id, e.target.value as JobStatus)}
                  className="rounded-lg border border-border bg-background px-2 py-1 text-sm capitalize outline-none focus:border-primary"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3 text-muted">
                {new Date(j.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
