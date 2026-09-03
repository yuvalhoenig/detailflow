-- DetailFlow initial schema: businesses, profiles, CRM entities, RLS.
create extension if not exists pgcrypto;

-- ============================================================
-- Core tables
-- ============================================================

create table businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  phone text,
  address text,
  timezone text default 'America/New_York',
  stripe_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  business_id uuid references businesses(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  role text not null default 'owner' check (role in ('owner', 'staff')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  first_name text not null,
  last_name text,
  email text,
  phone text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table vehicles (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  customer_id uuid not null references customers(id) on delete cascade,
  make text,
  model text,
  year int,
  color text,
  license_plate text,
  vin text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10, 2) not null default 0,
  duration_minutes int not null default 60,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table appointments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  customer_id uuid not null references customers(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete set null,
  scheduled_at timestamptz not null,
  duration_minutes int not null default 60,
  status text not null default 'scheduled'
    check (status in ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table jobs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  appointment_id uuid references appointments(id) on delete set null,
  customer_id uuid not null references customers(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete set null,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'completed', 'cancelled')),
  total numeric(10, 2) not null default 0,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table job_services (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  service_id uuid references services(id) on delete set null,
  description text not null,
  quantity int not null default 1,
  unit_price numeric(10, 2) not null default 0
);

create table quotes (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  customer_id uuid not null references customers(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete set null,
  status text not null default 'draft'
    check (status in ('draft', 'sent', 'accepted', 'declined', 'expired')),
  subtotal numeric(10, 2) not null default 0,
  tax numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  notes text,
  valid_until date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references quotes(id) on delete cascade,
  service_id uuid references services(id) on delete set null,
  description text not null,
  quantity int not null default 1,
  unit_price numeric(10, 2) not null default 0
);

create table invoices (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  customer_id uuid not null references customers(id) on delete cascade,
  job_id uuid references jobs(id) on delete set null,
  quote_id uuid references quotes(id) on delete set null,
  status text not null default 'draft'
    check (status in ('draft', 'sent', 'paid', 'overdue', 'void')),
  subtotal numeric(10, 2) not null default 0,
  tax numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  amount_paid numeric(10, 2) not null default 0,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  description text not null,
  quantity int not null default 1,
  unit_price numeric(10, 2) not null default 0
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  invoice_id uuid references invoices(id) on delete set null,
  customer_id uuid not null references customers(id) on delete cascade,
  amount numeric(10, 2) not null,
  method text not null default 'card' check (method in ('card', 'cash', 'check', 'other')),
  stripe_payment_intent_id text,
  status text not null default 'succeeded'
    check (status in ('pending', 'succeeded', 'failed', 'refunded')),
  paid_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table photos (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  job_id uuid references jobs(id) on delete cascade,
  customer_id uuid references customers(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete cascade,
  type text not null default 'before' check (type in ('before', 'after')),
  storage_path text not null,
  created_at timestamptz not null default now()
);

create table customer_notes (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  customer_id uuid not null references customers(id) on delete cascade,
  author_id uuid references profiles(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  assigned_to uuid references profiles(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'open' check (status in ('open', 'in_progress', 'done')),
  due_date date,
  customer_id uuid references customers(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table activity (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  actor_id uuid references profiles(id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null unique references businesses(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  status text not null default 'active'
    check (status in ('active', 'trialing', 'past_due', 'canceled')),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Indexes
-- ============================================================

create index on profiles (business_id);
create index on customers (business_id);
create index on vehicles (business_id);
create index on vehicles (customer_id);
create index on services (business_id);
create index on appointments (business_id);
create index on appointments (customer_id);
create index on appointments (scheduled_at);
create index on jobs (business_id);
create index on jobs (customer_id);
create index on job_services (job_id);
create index on quotes (business_id);
create index on quotes (customer_id);
create index on quote_items (quote_id);
create index on invoices (business_id);
create index on invoices (customer_id);
create index on invoice_items (invoice_id);
create index on payments (business_id);
create index on payments (invoice_id);
create index on photos (business_id);
create index on customer_notes (business_id);
create index on customer_notes (customer_id);
create index on tasks (business_id);
create index on activity (business_id);
create index on activity (created_at);

-- ============================================================
-- Helpers
-- ============================================================

create function auth_business_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select business_id from profiles where id = auth.uid();
$$;

create function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'businesses', 'profiles', 'customers', 'vehicles', 'services',
    'appointments', 'jobs', 'quotes', 'invoices', 'tasks', 'subscriptions'
  ]
  loop
    execute format(
      'create trigger set_updated_at before update on %I for each row execute function set_updated_at()',
      t
    );
  end loop;
end $$;

-- Create a business + owner profile automatically when a user signs up.
create function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================

alter table businesses enable row level security;
alter table profiles enable row level security;
alter table customers enable row level security;
alter table vehicles enable row level security;
alter table services enable row level security;
alter table appointments enable row level security;
alter table jobs enable row level security;
alter table job_services enable row level security;
alter table quotes enable row level security;
alter table quote_items enable row level security;
alter table invoices enable row level security;
alter table invoice_items enable row level security;
alter table payments enable row level security;
alter table photos enable row level security;
alter table customer_notes enable row level security;
alter table tasks enable row level security;
alter table activity enable row level security;
alter table subscriptions enable row level security;

-- businesses: members can view/update their own business; owner can insert.
create policy "businesses_select_own" on businesses
  for select using (id = auth_business_id() or owner_id = auth.uid());

create policy "businesses_insert_owner" on businesses
  for insert with check (owner_id = auth.uid());

create policy "businesses_update_own" on businesses
  for update using (id = auth_business_id());

-- profiles: users can view/update their own profile, and teammates in the same business.
create policy "profiles_select_self_or_business" on profiles
  for select using (id = auth.uid() or business_id = auth_business_id());

create policy "profiles_update_self" on profiles
  for update using (id = auth.uid());

create policy "profiles_insert_self" on profiles
  for insert with check (id = auth.uid());

-- generic per-business CRUD policy for all business-scoped tables.
do $$
declare
  t text;
begin
  foreach t in array array[
    'customers', 'vehicles', 'services', 'appointments', 'jobs', 'quotes',
    'invoices', 'payments', 'photos', 'customer_notes', 'tasks', 'activity',
    'subscriptions'
  ]
  loop
    execute format(
      'create policy "%1$s_business_isolation" on %1$s for all using (business_id = auth_business_id()) with check (business_id = auth_business_id())',
      t
    );
  end loop;
end $$;

-- line-item tables inherit isolation via their parent's business_id.
create policy "job_services_via_job" on job_services
  for all using (
    exists (select 1 from jobs j where j.id = job_id and j.business_id = auth_business_id())
  )
  with check (
    exists (select 1 from jobs j where j.id = job_id and j.business_id = auth_business_id())
  );

create policy "quote_items_via_quote" on quote_items
  for all using (
    exists (select 1 from quotes q where q.id = quote_id and q.business_id = auth_business_id())
  )
  with check (
    exists (select 1 from quotes q where q.id = quote_id and q.business_id = auth_business_id())
  );

create policy "invoice_items_via_invoice" on invoice_items
  for all using (
    exists (select 1 from invoices i where i.id = invoice_id and i.business_id = auth_business_id())
  )
  with check (
    exists (select 1 from invoices i where i.id = invoice_id and i.business_id = auth_business_id())
  );
