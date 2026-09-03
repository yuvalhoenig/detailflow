"use client";

import { useMemo, useState } from "react";

export type CustomerOption = {
  id: string;
  name: string;
  vehicles: { id: string; label: string }[];
};

export function CustomerVehicleSelect({
  customers,
  defaultCustomerId,
  defaultVehicleId,
}: {
  customers: CustomerOption[];
  defaultCustomerId?: string;
  defaultVehicleId?: string;
}) {
  const [customerId, setCustomerId] = useState(defaultCustomerId ?? "");

  const vehicles = useMemo(
    () => customers.find((c) => c.id === customerId)?.vehicles ?? [],
    [customers, customerId],
  );

  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-sm font-medium text-foreground">Customer</label>
        <select
          name="customerId"
          required
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="" disabled>
            Select a customer
          </option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground">Vehicle</label>
        <select
          name="vehicleId"
          defaultValue={defaultVehicleId ?? ""}
          disabled={vehicles.length === 0}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-50"
        >
          <option value="">None</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
