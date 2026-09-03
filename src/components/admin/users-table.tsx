"use client";

import { useState, useTransition } from "react";
import { ShieldCheck, ShieldOff, Ban, ShieldAlert, Trash2 } from "lucide-react";
import {
  setPlatformAdmin,
  banUser,
  deleteUserAccount,
} from "@/lib/actions/admin";

export type AdminUserRow = {
  id: string;
  email: string;
  businessName: string;
  role: string;
  isPlatformAdmin: boolean;
  isBanned: boolean;
  createdAt: string;
};

export function UsersTable({ users }: { users: AdminUserRow[] }) {
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
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Business</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-muted">
                No users yet.
              </td>
            </tr>
          ) : (
            users.map((u) => {
              const busy = isPending && pendingId === u.id;
              return (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {u.email}
                    {u.isPlatformAdmin && (
                      <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        admin
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">{u.businessName}</td>
                  <td className="px-4 py-3 capitalize text-muted">{u.role}</td>
                  <td className="px-4 py-3">
                    {u.isBanned ? (
                      <span className="text-danger">Banned</span>
                    ) : (
                      <span className="text-success">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={busy}
                        title={u.isPlatformAdmin ? "Revoke admin" : "Make admin"}
                        onClick={() =>
                          run(u.id, () =>
                            setPlatformAdmin(u.id, !u.isPlatformAdmin),
                          )
                        }
                        className="text-muted hover:text-primary disabled:opacity-40"
                      >
                        {u.isPlatformAdmin ? (
                          <ShieldOff className="h-4 w-4" />
                        ) : (
                          <ShieldCheck className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        title={u.isBanned ? "Unban user" : "Ban user"}
                        onClick={() => run(u.id, () => banUser(u.id, !u.isBanned))}
                        className="text-muted hover:text-warning disabled:opacity-40"
                      >
                        {u.isBanned ? (
                          <ShieldAlert className="h-4 w-4" />
                        ) : (
                          <Ban className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        title="Delete user"
                        onClick={() => {
                          if (
                            confirm(
                              `Permanently delete ${u.email}? This cannot be undone.`,
                            )
                          ) {
                            run(u.id, () => deleteUserAccount(u.id));
                          }
                        }}
                        className="text-muted hover:text-danger disabled:opacity-40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
