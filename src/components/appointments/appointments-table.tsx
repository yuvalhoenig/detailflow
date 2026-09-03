"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import {
  updateAppointmentStatus,
  deleteAppointment,
  type AppointmentStatus,
} from "@/lib/actions/appointments";

export type AppointmentRow = {
  id: string;
  scheduledAt: string;
  durationMinutes: number;
  status: AppointmentStatus;
  customerId: string;
  customerName: string;
  vehicleLabel: string | null;
};

const STATUSES: AppointmentStatus[] = [
  "scheduled",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
];

export function AppointmentsTable({ appointments }: { appointments: AppointmentRow[] }) {
  if (appointments.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-border bg-card text-sm text-muted shadow-sm">
        No appointments scheduled yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
            <th className="px-4 py-3 font-medium">Date &amp; Time</th>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Vehicle</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3 text-foreground">
                {new Date(a.scheduledAt).toLocaleString()}
                <span className="ml-2 text-xs text-muted">
                  ({a.durationMinutes}m)
                </span>
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/dashboard/customers/${a.customerId}`}
                  className="font-medium text-foreground hover:text-primary"
                >
                  {a.customerName}
                </Link>
              </td>
              <td className="px-4 py-3 text-muted">{a.vehicleLabel ?? "—"}</td>
              <td className="px-4 py-3">
                <select
                  value={a.status}
                  onChange={(e) =>
                    updateAppointmentStatus(
                      a.id,
                      e.target.value as AppointmentStatus,
                    )
                  }
                  className="rounded-lg border border-border bg-background px-2 py-1 text-sm capitalize outline-none focus:border-primary"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => deleteAppointment(a.id)}
                  className="text-muted hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
