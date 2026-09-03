import { Activity as ActivityIcon } from "lucide-react";
import type { Json } from "@/lib/supabase/types";

export type ActivityEntry = {
  id: string;
  action: string;
  entity_type: string;
  metadata: Json;
  created_at: string;
};

function describe(entry: ActivityEntry) {
  const name =
    entry.metadata &&
    typeof entry.metadata === "object" &&
    !Array.isArray(entry.metadata) &&
    typeof entry.metadata.name === "string"
      ? entry.metadata.name
      : undefined;
  return `${entry.entity_type} ${entry.action}${name ? ` — ${name}` : ""}`;
}

export function ActivityTimeline({ entries }: { entries: ActivityEntry[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-foreground">Activity</h2>

      <div className="mt-4 space-y-3">
        {entries.length === 0 ? (
          <p className="text-sm text-muted">No activity yet.</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="flex items-start gap-3 text-sm">
              <ActivityIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
              <div>
                <p className="text-foreground">{describe(entry)}</p>
                <p className="text-xs text-muted">
                  {new Date(entry.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
