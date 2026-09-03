"use client";

import { useActionState, useState } from "react";
import { Plus, X } from "lucide-react";
import { createJob } from "@/lib/actions/jobs";
import { SubmitButton } from "@/components/auth/submit-button";
import {
  CustomerVehicleSelect,
  type CustomerOption,
} from "@/components/shared/customer-vehicle-select";
import { ServiceChecklist, type ServiceOption } from "@/components/shared/service-checklist";

export function AddJobDialog({
  customers,
  services,
}: {
  customers: CustomerOption[];
  services: ServiceOption[];
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(createJob, undefined);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Plus className="h-4 w-4" />
        New Job
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">New Job</h2>
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

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Services
                </label>
                <ServiceChecklist services={services} />
              </div>

              {state?.error && (
                <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
                  {state.error}
                </p>
              )}

              <SubmitButton>Create Job</SubmitButton>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
