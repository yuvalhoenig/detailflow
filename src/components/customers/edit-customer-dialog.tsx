"use client";

import { useActionState, useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { updateCustomer, deleteCustomer } from "@/lib/actions/customers";
import { SubmitButton } from "@/components/auth/submit-button";

type Customer = {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
};

export function EditCustomerDialog({ customer }: { customer: Customer }) {
  const [open, setOpen] = useState(false);
  const updateAction = updateCustomer.bind(null, customer.id);
  const [state, formAction] = useActionState(updateAction, undefined);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-background"
      >
        <Pencil className="h-4 w-4" />
        Edit
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Edit Customer
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    First name
                  </label>
                  <input
                    name="firstName"
                    required
                    defaultValue={customer.first_name}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Last name
                  </label>
                  <input
                    name="lastName"
                    defaultValue={customer.last_name ?? ""}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Email</label>
                <input
                  name="email"
                  type="email"
                  defaultValue={customer.email ?? ""}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Phone</label>
                <input
                  name="phone"
                  type="tel"
                  defaultValue={customer.phone ?? ""}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  Address
                </label>
                <input
                  name="address"
                  defaultValue={customer.address ?? ""}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              {state?.error && (
                <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
                  {state.error}
                </p>
              )}

              <div className="flex items-center gap-3">
                <SubmitButton>Save changes</SubmitButton>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Delete this customer? This cannot be undone.")) {
                      deleteCustomer(customer.id);
                    }
                  }}
                  className="flex items-center justify-center gap-2 rounded-lg border border-danger/30 px-4 py-2.5 text-sm font-medium text-danger hover:bg-danger/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
