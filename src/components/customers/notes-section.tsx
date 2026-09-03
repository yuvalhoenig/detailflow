"use client";

import { useActionState } from "react";
import { createCustomerNote } from "@/lib/actions/customer-notes";
import { SubmitButton } from "@/components/auth/submit-button";

export type Note = {
  id: string;
  body: string;
  created_at: string;
};

export function NotesSection({
  customerId,
  notes,
}: {
  customerId: string;
  notes: Note[];
}) {
  const addAction = createCustomerNote.bind(null, customerId);
  const [state, formAction] = useActionState(addAction, undefined);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-foreground">Notes</h2>

      <form action={formAction} className="mt-3 space-y-2">
        <textarea
          name="body"
          rows={2}
          placeholder="Add an internal note..."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
        {state?.error && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
            {state.error}
          </p>
        )}
        <SubmitButton className="w-auto px-4">Add Note</SubmitButton>
      </form>

      <div className="mt-4 space-y-3">
        {notes.length === 0 ? (
          <p className="text-sm text-muted">No notes yet.</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="rounded-lg border border-border p-3">
              <p className="text-sm text-foreground">{note.body}</p>
              <p className="mt-1 text-xs text-muted">
                {new Date(note.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
