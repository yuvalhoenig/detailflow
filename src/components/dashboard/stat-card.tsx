import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "primary",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: "primary" | "secondary";
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted">{label}</p>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            accent === "primary"
              ? "bg-primary/10 text-primary"
              : "bg-secondary/10 text-secondary",
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}
