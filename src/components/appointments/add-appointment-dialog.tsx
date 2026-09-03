"use client";

import { useActionState, useState } from "react";
import { Plus, X } from "lucide-react";
import { createAppointment } from "@/lib/actions/appointments";
import { SubmitButton } from "@/components/auth/submit-button";
import {
  CustomerVehicleSelect,
  type CustomerOption,
} from "@/components/shared/customer-vehicle-select";

export function AddAppointmentDialog({ customers }: { customers: CustomerOption[] }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(createAppointment, undefined);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Plus className="h-4 w-4" />
        New Appointment
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                New Appointment
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form action={formAction} className="space-y-4">
              <CustomerVehicleSelect customers={customers} />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Date &amp; time
                  </label>
                  <input
                    name="scheduledAt"
                    type="datetime-local"
                    required
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Duration (min)
                  </label>
                  <input
                    name="durationMinutes"
                    type="number"
                    min="15"
                    step="15"
                    defaultValue={60}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Notes</label>
                <textarea
                  name="notes"
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              {state?.error && (
                <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
                  {state.error}
                </p>
              )}

              <SubmitButton>Schedule Appointment</SubmitButton>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
