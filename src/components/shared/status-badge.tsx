import { cn } from "@/lib/utils";

const COLORS: Record<string, string> = {
  pending: "bg-muted/10 text-muted",
  scheduled: "bg-muted/10 text-muted",
  in_progress: "bg-primary/10 text-primary",
  confirmed: "bg-primary/10 text-primary",
  sent: "bg-primary/10 text-primary",
  completed: "bg-success/10 text-success",
  paid: "bg-success/10 text-success",
  accepted: "bg-success/10 text-success",
  cancelled: "bg-danger/10 text-danger",
  declined: "bg-danger/10 text-danger",
  void: "bg-danger/10 text-danger",
  no_show: "bg-danger/10 text-danger",
  overdue: "bg-warning/10 text-warning",
  expired: "bg-warning/10 text-warning",
  draft: "bg-muted/10 text-muted",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-medium capitalize",
        COLORS[status] ?? "bg-muted/10 text-muted",
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
}
