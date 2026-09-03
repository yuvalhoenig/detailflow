"use client";

import { useActionState } from "react";
import { recordPayment } from "@/lib/actions/payments";
import { SubmitButton } from "@/components/auth/submit-button";

export function RecordPaymentForm({
  invoiceId,
  balanceDue,
}: {
  invoiceId: string;
  balanceDue: number;
}) {
  const action = recordPayment.bind(null, invoiceId);
  const [state, formAction] = useActionState(action, undefined);

  if (balanceDue <= 0) return null;

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <div>
        <label className="text-sm font-medium text-foreground">Amount</label>
        <input
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          max={balanceDue}
          defaultValue={balanceDue.toFixed(2)}
          className="mt-1 w-32 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground">Method</label>
        <select
          name="method"
          className="mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="card">Card</option>
          <option value="cash">Cash</option>
          <option value="check">Check</option>
          <option value="other">Other</option>
        </select>
      </div>
      <SubmitButton className="w-auto px-4">Record Payment</SubmitButton>
      {state?.error && (
        <p className="w-full rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          {state.error}
        </p>
      )}
    </form>
  );
}
