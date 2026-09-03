"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/shared/status-badge";

export type InvoiceRow = {
  id: string;
  customerId: string;
  customerName: string;
  total: number;
  amountPaid: number;
  status: string;
  dueDate: string | null;
};

export function InvoicesTable({ invoices }: { invoices: InvoiceRow[] }) {
  if (invoices.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-border bg-card text-sm text-muted shadow-sm">
        No invoices yet.
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
            <th className="px-4 py-3 font-medium">Balance</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Due</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3">
                <Link
                  href={`/dashboard/invoices/${inv.id}`}
                  className="font-medium text-foreground hover:text-primary"
                >
                  {inv.customerName}
                </Link>
              </td>
              <td className="px-4 py-3 text-muted">${inv.total.toFixed(2)}</td>
              <td className="px-4 py-3 text-muted">
                ${(inv.total - inv.amountPaid).toFixed(2)}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={inv.status} />
              </td>
              <td className="px-4 py-3 text-muted">
                {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
