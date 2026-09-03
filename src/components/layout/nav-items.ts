import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Wrench,
  FileText,
  Receipt,
  CreditCard,
  MessageSquare,
  CheckSquare,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Appointments", href: "/dashboard/appointments", icon: CalendarDays },
  { label: "Jobs", href: "/dashboard/jobs", icon: Wrench },
  { label: "Quotes", href: "/dashboard/quotes", icon: FileText },
  { label: "Invoices", href: "/dashboard/invoices", icon: Receipt },
  { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { label: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];
