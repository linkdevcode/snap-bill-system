/*
  SnapBill — create public.invoices

  Matches SRS §3 (Table: invoices): metadata, totals, notes, JSONB sender_data /
  client_data / items. RLS policies isolate rows to the owning authenticated user.

  Apply with Supabase CLI (after `supabase login` + `supabase link`), or without global install:
    npx supabase@latest db push --linked
*/

-- gen_random_uuid() is available on Supabase-hosted Postgres (pgcrypto enabled by default).

create table public.invoices (
  id uuid primary key default gen_random_uuid(),

  user_id uuid references auth.users (id) on delete cascade,

  invoice_number text not null,
  status text not null,
  constraint invoices_status_check check (
    status in ('draft', 'sent', 'paid', 'overdue')
  ),

  issue_date date not null,
  due_date date not null,

  sender_data jsonb not null,
  client_data jsonb not null,
  items jsonb not null,

  tax_rate numeric not null default 0,
  discount_rate numeric not null default 0,
  subtotal numeric not null default 0,
  total_amount numeric not null default 0,

  notes text,

  created_at timestamptz not null default now()
);

comment on table public.invoices is 'SnapBill invoice records (JSONB payloads + totals).';

comment on column public.invoices.sender_data is 'JSONB: sender / company payload (company, address, email, VAT, logo, etc.).';
comment on column public.invoices.client_data is 'JSONB: billing client payload (name, email, address).';
comment on column public.invoices.items is 'JSONB: array of line items [{ description, quantity, unit_price }, ...].';

create index invoices_user_id_idx on public.invoices (user_id);
create index invoices_user_id_created_at_idx on public.invoices (user_id, created_at desc);

alter table public.invoices enable row level security;

-- Authenticated users may only access rows they own.

create policy "invoices_select_own"
  on public.invoices
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "invoices_insert_own"
  on public.invoices
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "invoices_update_own"
  on public.invoices
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "invoices_delete_own"
  on public.invoices
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Harden surface: anon should not touch this table; authenticated uses RLS above.
revoke all on table public.invoices from anon;
grant select, insert, update, delete on table public.invoices to authenticated;
