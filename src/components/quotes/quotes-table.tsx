"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/shared/status-badge";

export type QuoteRow = {
  id: string;
  customerId: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
};

export function QuotesTable({ quotes }: { quotes: QuoteRow[] }) {
  if (quotes.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-border bg-card text-sm text-muted shadow-sm">
        No quotes yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Total</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Created</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((q) => (
            <tr key={q.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3">
                <Link
                  href={`/dashboard/quotes/${q.id}`}
                  className="font-medium text-foreground hover:text-primary"
                >
                  {q.customerName}
                </Link>
              </td>
              <td className="px-4 py-3 text-muted">${q.total.toFixed(2)}</td>
              <td className="px-4 py-3">
                <StatusBadge status={q.status} />
              </td>
              <td className="px-4 py-3 text-muted">
                {new Date(q.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
