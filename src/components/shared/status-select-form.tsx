"use client";

export function StatusSelectForm({
  action,
  currentStatus,
  statuses,
}: {
  action: (formData: FormData) => Promise<void>;
  currentStatus: string;
  statuses: readonly string[];
}) {
  return (
    <form action={action}>
      <select
        name="status"
        defaultValue={currentStatus}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-lg border border-border bg-background px-2 py-2 text-sm capitalize outline-none focus:border-primary"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </form>
  );
}
