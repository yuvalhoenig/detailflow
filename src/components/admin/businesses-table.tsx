"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { updateBusinessPlan, deleteBusiness } from "@/lib/actions/admin";

export type AdminBusinessRow = {
  id: string;
  name: string;
  ownerEmail: string;
  plan: "free" | "pro";
  createdAt: string;
};

export function BusinessesTable({ businesses }: { businesses: AdminBusinessRow[] }) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function run(id: string, action: () => Promise<unknown>) {
    setPendingId(id);
    startTransition(async () => {
      await action();
      setPendingId(null);
    });
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
            <th className="px-4 py-3 font-medium">Business</th>
            <th className="px-4 py-3 font-medium">Owner</th>
            <th className="px-4 py-3 font-medium">Plan</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {businesses.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-muted">
                No businesses yet.
              </td>
            </tr>
          ) : (
            businesses.map((b) => {
              const busy = isPending && pendingId === b.id;
              return (
                <tr key={b.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">{b.name}</td>
                  <td className="px-4 py-3 text-muted">{b.ownerEmail}</td>
                  <td className="px-4 py-3">
                    <select
                      value={b.plan}
                      disabled={busy}
                      onChange={(e) =>
                        run(b.id, () =>
                          updateBusinessPlan(b.id, e.target.value as "free" | "pro"),
                        )
                      }
                      className="rounded-lg border border-border bg-background px-2 py-1 text-sm capitalize outline-none focus:border-primary disabled:opacity-40"
                    >
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      disabled={busy}
                      title="Delete business"
                      onClick={() => {
                        if (
                          confirm(
                            `Permanently delete "${b.name}" and all its data? This cannot be undone.`,
                          )
                        ) {
                          run(b.id, () => deleteBusiness(b.id));
                        }
                      }}
                      className="text-muted hover:text-danger disabled:opacity-40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
