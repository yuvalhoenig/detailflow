export function PagePlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      <p className="mt-1 text-sm text-muted">{description}</p>
      <div className="mt-6 flex h-64 items-center justify-center rounded-2xl border border-dashed border-border bg-card text-sm text-muted shadow-sm">
        {title} coming soon
      </div>
    </div>
  );
}
