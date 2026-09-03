import { Users, CalendarDays, Receipt, DollarSign } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">
        Overview of your detailing business
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Customers" value="—" icon={Users} />
        <StatCard
          label="Upcoming Appointments"
          value="—"
          icon={CalendarDays}
          accent="secondary"
        />
        <StatCard label="Outstanding Invoices" value="—" icon={Receipt} />
        <StatCard
          label="Revenue (30d)"
          value="—"
          icon={DollarSign}
          accent="secondary"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted shadow-sm">
        Connect Supabase to load real business data.
      </div>
    </div>
  );
}
