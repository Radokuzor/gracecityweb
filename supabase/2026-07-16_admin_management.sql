-- Incremental migration for the Accounts tab in /admin (grant/revoke admin access).
-- Run this once in the Supabase SQL Editor. Safe to run on the existing project —
-- it only adds new policies, it does not touch existing tables/data.

-- Admins can see every row in the allowlist (not just their own).
create policy "admins can read all admin rows"
  on public.admins for select
  using (public.is_admin());

-- Admins can grant admin access to another user.
create policy "admins can add admins"
  on public.admins for insert
  with check (public.is_admin());

-- Admins can revoke admin access.
create policy "admins can remove admins"
  on public.admins for delete
  using (public.is_admin());

-- Admins can see every signed-up account (for the Accounts tab).
create policy "admins can read all profiles"
  on public.profiles for select
  using (public.is_admin());
