-- Grace City backend schema
-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query) on a fresh project.

-- ── Extensions ──────────────────────────────────────────────────
create extension if not exists pgcrypto;

-- ── Admins allowlist ────────────────────────────────────────────
-- Membership here is what turns a Supabase Auth user into an /admin user.
-- A signed-up public user is NOT an admin unless their auth user id is added here.
create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- ── Helper: is the current user an admin? ──────────────────────
-- security definer + bypasses RLS internally, so it's safe to use inside
-- the admins/profiles policies below without causing infinite recursion.
create function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- A logged-in user may only check their OWN membership row (not list all admins).
create policy "admins can read own row"
  on public.admins for select
  using (user_id = auth.uid());

-- Existing admins can see the full allowlist and grant/revoke admin access.
create policy "admins can read all admin rows"
  on public.admins for select
  using (public.is_admin());
create policy "admins can add admins"
  on public.admins for insert
  with check (public.is_admin());
create policy "admins can remove admins"
  on public.admins for delete
  using (public.is_admin());

-- ── Public member profiles (for the sign-up/log-in feature) ────
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  phone text,
  email text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "users can read own profile"
  on public.profiles for select
  using (id = auth.uid());

-- Admins can see every signed-up account (for the Accounts tab in /admin).
create policy "admins can read all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "users can update own profile"
  on public.profiles for update
  using (id = auth.uid());

-- Auto-create a profile row whenever someone signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name, phone)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Form submission tables ──────────────────────────────────────
-- Public inserts go through the service-role key (bypasses RLS) via /api/forms/*,
-- so these tables have NO public insert/select policy — only admins can read them.

create table public.plan_a_visit (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  visit_date date,
  hear_about_us text,
  attending_with text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.plan_a_visit enable row level security;
create policy "admins manage plan_a_visit" on public.plan_a_visit
  for all using (public.is_admin()) with check (public.is_admin());

create table public.connect_cards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  address text,
  decision text,
  groups_interest text[],
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.connect_cards enable row level security;
create policy "admins manage connect_cards" on public.connect_cards
  for all using (public.is_admin()) with check (public.is_admin());

create table public.prayer_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  request text not null,
  is_private boolean not null default false,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.prayer_requests enable row level security;
create policy "admins manage prayer_requests" on public.prayer_requests
  for all using (public.is_admin()) with check (public.is_admin());

create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.contact_submissions enable row level security;
create policy "admins manage contact_submissions" on public.contact_submissions
  for all using (public.is_admin()) with check (public.is_admin());

-- ── Livestreams ───────────────────────────────────────────────
-- Read publicly (Watch Live page), managed only by admins.
create table public.livestreams (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  youtube_url text not null,
  youtube_live_id text,
  description text,
  is_live boolean not null default false,
  scheduled_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.livestreams enable row level security;
create policy "anyone can read livestreams" on public.livestreams
  for select using (true);
create policy "admins manage livestreams" on public.livestreams
  for insert with check (public.is_admin());
create policy "admins update livestreams" on public.livestreams
  for update using (public.is_admin()) with check (public.is_admin());
create policy "admins delete livestreams" on public.livestreams
  for delete using (public.is_admin());

-- ── Events ────────────────────────────────────────────────────
-- Read publicly (Calendar page), managed only by admins.
create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  start_time timestamptz not null,
  end_time timestamptz,
  location text,
  created_at timestamptz not null default now()
);
alter table public.events enable row level security;
create policy "anyone can read events" on public.events
  for select using (true);
create policy "admins manage events" on public.events
  for insert with check (public.is_admin());
create policy "admins update events" on public.events
  for update using (public.is_admin()) with check (public.is_admin());
create policy "admins delete events" on public.events
  for delete using (public.is_admin());
