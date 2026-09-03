import { DollarSign, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function CustomerStats({
  totalSpent,
  appointmentCount,
  avgJobValue,
  outstandingBalance,
}: {
  totalSpent: number;
  appointmentCount: number;
  avgJobValue: number;
  outstandingBalance: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard label="Total Spent" value={formatCurrency(totalSpent)} icon={DollarSign} />
      <StatCard
        label="Appointments"
        value={String(appointmentCount)}
        icon={Calendar}
        accent="secondary"
      />
      <StatCard label="Avg Job Value" value={formatCurrency(avgJobValue)} icon={TrendingUp} />
      <StatCard
        label="Outstanding Balance"
        value={formatCurrency(outstandingBalance)}
        icon={AlertCircle}
        accent="secondary"
      />
    </div>
  );
}
