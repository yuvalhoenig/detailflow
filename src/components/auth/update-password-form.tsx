"use client";

import { useActionState } from "react";
import { updatePassword } from "@/lib/actions/auth";
import { SubmitButton } from "./submit-button";

export function UpdatePasswordForm() {
  const [state, formAction] = useActionState(updatePassword, undefined);

  return (
    <div>
      <h1 className="text-xl font-semibold text-foreground">Set a new password</h1>
      <p className="mt-1 text-sm text-muted">Choose a new password for your account</p>

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            New password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        {state?.error && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
            {state.error}
          </p>
        )}

        <SubmitButton>Update password</SubmitButton>
      </form>
    </div>
  );
}
