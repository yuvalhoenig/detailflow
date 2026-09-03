"use client";

import { useActionState } from "react";
import { updateBusinessProfile } from "@/lib/actions/business-profile";
import { SubmitButton } from "@/components/auth/submit-button";

export function BusinessProfileForm({
  business,
}: {
  business: { name: string; phone: string | null; address: string | null };
}) {
  const [state, formAction] = useActionState(updateBusinessProfile, undefined);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-foreground">Business Profile</h2>

      <form action={formAction} className="mt-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground">
            Business name
          </label>
          <input
            name="name"
            required
            defaultValue={business.name}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Phone</label>
          <input
            name="phone"
            type="tel"
            defaultValue={business.phone ?? ""}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Address</label>
          <input
            name="address"
            defaultValue={business.address ?? ""}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        {state?.error && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
            {state.error}
          </p>
        )}

        <SubmitButton className="w-auto px-4">Save changes</SubmitButton>
      </form>
    </div>
  );
}
