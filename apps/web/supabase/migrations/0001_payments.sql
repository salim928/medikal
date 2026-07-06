-- Payments table + RLS. Run in the Supabase SQL editor (or via supabase db push).
-- Webhook/fulfillment handlers (Stripe + Paystack) write here using the service role.

create table if not exists public.payments (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid references auth.users (id) on delete set null,
  provider           text not null check (provider in ('stripe', 'paystack')),
  provider_reference text not null,        -- payment_intent id / paystack reference
  type               text,                 -- consultation | subscription | prescription | ...
  amount             numeric(12, 2) not null,
  currency           text not null,
  status             text not null,        -- success | failed | pending
  appointment_id     uuid,
  subscription_plan  text,
  channel            text,
  metadata           jsonb,
  paid_at            timestamptz,
  created_at         timestamptz not null default now(),
  unique (provider, provider_reference)
);

create index if not exists payments_user_id_idx on public.payments (user_id);
create index if not exists payments_appointment_id_idx on public.payments (appointment_id);

alter table public.payments enable row level security;

-- Patients can read their own payments.
drop policy if exists "payments_select_own" on public.payments;
create policy "payments_select_own"
  on public.payments for select
  using (auth.uid() = user_id);

-- Writes happen only via the service role (webhooks/verification), which bypasses RLS.
-- No INSERT/UPDATE policy for normal users is intentional.

-- Best-effort: track payment state on appointments if that table exists.
alter table if exists public.appointments
  add column if not exists payment_status text default 'unpaid';
alter table if exists public.appointments
  add column if not exists payment_reference text;
