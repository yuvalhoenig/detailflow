"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Users } from "lucide-react";

export type CustomerRow = {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  vehicle_count: number;
  created_at: string;
};

export function CustomersTable({ customers }: { customers: CustomerRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) =>
      `${c.first_name} ${c.last_name ?? ""} ${c.email ?? ""} ${c.phone ?? ""}`
        .toLowerCase()
        .includes(q),
    );
  }, [customers, query]);

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 sm:max-w-xs">
        <Search className="h-4 w-4 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search customers..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card text-sm text-muted shadow-sm">
          <Users className="h-6 w-6" />
          {customers.length === 0
            ? "No customers yet. Add your first one to get started."
            : "No customers match your search."}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Vehicles</th>
                <th className="px-4 py-3 font-medium">Added</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-border last:border-0 hover:bg-background"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/customers/${customer.id}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {customer.first_name} {customer.last_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {customer.email || customer.phone || "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">{customer.vehicle_count}</td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
