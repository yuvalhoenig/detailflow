"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/lib/actions/auth";
import { SubmitButton } from "./submit-button";
import { GoogleButton } from "./google-button";

export function LoginForm({ message }: { message?: string }) {
  const [state, formAction] = useActionState(login, undefined);

  return (
    <div>
      <h1 className="text-xl font-semibold text-foreground">Welcome back</h1>
      <p className="mt-1 text-sm text-muted">Log in to your DetailFlow account</p>

      {message === "check-email" && (
        <p className="mt-4 rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">
          Check your email to continue.
        </p>
      )}

      <div className="mt-6">
        <GoogleButton />
      </div>

      <div className="my-6 flex items-center gap-3 text-xs text-muted">
        <div className="h-px flex-1 bg-border" />
        or
        <div className="h-px flex-1 bg-border" />
      </div>

      <form action={formAction} className="space-y-4">
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
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        {state?.error && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
            {state.error}
          </p>
        )}

        <SubmitButton>Log in</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
