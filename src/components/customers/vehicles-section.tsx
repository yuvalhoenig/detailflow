"use client";

import { useActionState, useState } from "react";
import { Car, Plus, Trash2 } from "lucide-react";
import { createVehicle, deleteVehicle } from "@/lib/actions/vehicles";
import { SubmitButton } from "@/components/auth/submit-button";

export type Vehicle = {
  id: string;
  make: string | null;
  model: string | null;
  year: number | null;
  color: string | null;
  license_plate: string | null;
};

export function VehiclesSection({
  customerId,
  vehicles,
}: {
  customerId: string;
  vehicles: Vehicle[];
}) {
  const [adding, setAdding] = useState(false);
  const addAction = createVehicle.bind(null, customerId);
  const [state, formAction] = useActionState(addAction, undefined);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Vehicles</h2>
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      {adding && (
        <form action={formAction} className="mt-4 space-y-3 rounded-lg border border-border p-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              name="make"
              placeholder="Make"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <input
              name="model"
              placeholder="Model"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <input
              name="year"
              type="number"
              placeholder="Year"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <input
              name="color"
              placeholder="Color"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <input
              name="licensePlate"
              placeholder="Plate"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          {state?.error && (
            <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
              {state.error}
            </p>
          )}
          <SubmitButton>Add Vehicle</SubmitButton>
        </form>
      )}

      <div className="mt-4 space-y-2">
        {vehicles.length === 0 && !adding ? (
          <p className="text-sm text-muted">No vehicles on file.</p>
        ) : (
          vehicles.map((v) => (
            <div
              key={v.id}
              className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
            >
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Car className="h-4 w-4 text-muted" />
                {[v.year, v.make, v.model].filter(Boolean).join(" ") || "Vehicle"}
                {v.color && <span className="text-muted">· {v.color}</span>}
                {v.license_plate && (
                  <span className="text-muted">· {v.license_plate}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => deleteVehicle(customerId, v.id)}
                className="text-muted hover:text-danger"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
