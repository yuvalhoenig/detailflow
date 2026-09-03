import { Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-semibold text-foreground">
            DetailFlow
          </span>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
