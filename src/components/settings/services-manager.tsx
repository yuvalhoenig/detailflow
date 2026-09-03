"use client";

import { useActionState, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  createService,
  updateService,
  toggleServiceActive,
  deleteService,
} from "@/lib/actions/services";
import { SubmitButton } from "@/components/auth/submit-button";

export type Service = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
  active: boolean;
};

function ServiceForm({
  service,
  onDone,
}: {
  service?: Service;
  onDone: () => void;
}) {
  const action = service
    ? updateService.bind(null, service.id)
    : createService;
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-border p-4">
      <div>
        <label className="text-sm font-medium text-foreground">Name</label>
        <input
          name="name"
          required
          defaultValue={service?.name}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground">Description</label>
        <input
          name="description"
          defaultValue={service?.description ?? ""}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-foreground">Price ($)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={service?.price ?? 0}
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
            min="0"
            defaultValue={service?.duration_minutes ?? 60}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>
      {state?.error && (
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          {state.error}
        </p>
      )}
      <div className="flex gap-2">
        <SubmitButton className="w-auto px-4">
          {service ? "Save" : "Add Service"}
        </SubmitButton>
        <button
          type="button"
          onClick={onDone}
          className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-background"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function ServicesManager({ services }: { services: Service[] }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Services</h2>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        )}
      </div>

      {adding && (
        <div className="mt-4">
          <ServiceForm onDone={() => setAdding(false)} />
        </div>
      )}

      <div className="mt-4 space-y-2">
        {services.length === 0 && !adding ? (
          <p className="text-sm text-muted">No services yet.</p>
        ) : (
          services.map((s) =>
            editingId === s.id ? (
              <ServiceForm
                key={s.id}
                service={s}
                onDone={() => setEditingId(null)}
              />
            ) : (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {s.name}{" "}
                    {!s.active && (
                      <span className="text-xs text-muted">(inactive)</span>
                    )}
                  </p>
                  <p className="text-xs text-muted">
                    ${Number(s.price).toFixed(2)} · {s.duration_minutes} min
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleServiceActive(s.id, !s.active)}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    {s.active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(s.id)}
                    className="text-muted hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteService(s.id)}
                    className="text-muted hover:text-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ),
          )
        )}
      </div>
    </div>
  );
}
