import { CalendarClock } from "lucide-react";

export type UpcomingAppointment = {
  id: string;
  scheduled_at: string;
  status: string;
};

export function UpcomingAppointments({
  appointments,
}: {
  appointments: UpcomingAppointment[];
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-foreground">
        Upcoming Appointments
      </h2>

      <div className="mt-4 space-y-2">
        {appointments.length === 0 ? (
          <p className="text-sm text-muted">No upcoming appointments.</p>
        ) : (
          appointments.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-3 rounded-lg border border-border px-3 py-2 text-sm"
            >
              <CalendarClock className="h-4 w-4 text-muted" />
              <span className="text-foreground">
                {new Date(a.scheduled_at).toLocaleString()}
              </span>
              <span className="ml-auto capitalize text-muted">{a.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
