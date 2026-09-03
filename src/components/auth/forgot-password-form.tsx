"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/actions/auth";
import { SubmitButton } from "./submit-button";

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(requestPasswordReset, undefined);

  return (
    <div>
      <h1 className="text-xl font-semibold text-foreground">Reset your password</h1>
      <p className="mt-1 text-sm text-muted">
        We&apos;ll email you a link to reset it
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        {state?.error && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
            {state.error}
          </p>
        )}

        <SubmitButton>Send reset link</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/login" className="font-medium text-primary hover:underline">
          Back to log in
        </Link>
      </p>
    </div>
  );
}
