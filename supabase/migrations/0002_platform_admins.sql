-- Platform administrators: internal staff who can manage every business's
-- data (support, billing, moderation) instead of only their own, unlike
-- regular business owners/staff.
create table platform_admins (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table platform_admins enable row level security;

create function is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from platform_admins where id = auth.uid());
$$;

-- Only an existing admin (checked via the security-definer function above,
-- never direct table reads) can see who else is an admin.
create policy "platform_admins_select_self_or_admin" on platform_admins
  for select using (id = auth.uid() or is_platform_admin());

-- Grant platform admins full visibility across every business, on top of
-- each table's existing per-business isolation policy.
do $$
declare
  t text;
begin
  foreach t in array array[
    'businesses', 'profiles', 'customers', 'vehicles', 'services',
    'appointments', 'jobs', 'quotes', 'invoices', 'payments', 'photos',
    'customer_notes', 'tasks', 'activity', 'subscriptions'
  ]
  loop
    execute format(
      'create policy "%1$s_platform_admin_bypass" on %1$s for all using (is_platform_admin()) with check (is_platform_admin())',
      t
    );
  end loop;
end $$;

create policy "job_services_platform_admin_bypass" on job_services
  for all using (is_platform_admin()) with check (is_platform_admin());

create policy "quote_items_platform_admin_bypass" on quote_items
  for all using (is_platform_admin()) with check (is_platform_admin());

create policy "invoice_items_platform_admin_bypass" on invoice_items
  for all using (is_platform_admin()) with check (is_platform_admin());
