"use client";

export type ServiceOption = {
  id: string;
  name: string;
  price: number;
};

export function ServiceChecklist({ services }: { services: ServiceOption[] }) {
  if (services.length === 0) {
    return (
      <p className="text-sm text-muted">
        No active services yet — add some in Settings first.
      </p>
    );
  }

  return (
    <div className="space-y-2 rounded-lg border border-border p-3">
      {services.map((s) => (
        <label key={s.id} className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-foreground">
            <input type="checkbox" name="serviceIds" value={s.id} />
            {s.name}
          </span>
          <span className="text-muted">${Number(s.price).toFixed(2)}</span>
        </label>
      ))}
    </div>
  );
}
