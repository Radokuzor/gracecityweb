-- ============================================================
-- BLW Grace City Church — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Plan a Visit submissions
CREATE TABLE IF NOT EXISTS plan_a_visit (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name            text        NOT NULL,
  email           text        NOT NULL,
  phone           text,
  visit_date      date,
  hear_about_us   text,
  attending_with  text,
  is_read         boolean     DEFAULT false,
  created_at      timestamptz DEFAULT now()
);

-- Connect Cards
CREATE TABLE IF NOT EXISTS connect_cards (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name            text        NOT NULL,
  email           text        NOT NULL,
  phone           text,
  address         text,
  decision        text,
  groups_interest text[],
  is_read         boolean     DEFAULT false,
  created_at      timestamptz DEFAULT now()
);

-- Prayer Requests
CREATE TABLE IF NOT EXISTS prayer_requests (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name            text        NOT NULL,
  email           text,
  request         text        NOT NULL,
  is_private      boolean     DEFAULT false,
  is_read         boolean     DEFAULT false,
  created_at      timestamptz DEFAULT now()
);

-- Contact / Say Hello submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name            text        NOT NULL,
  email           text        NOT NULL,
  phone           text,
  message         text        NOT NULL,
  is_read         boolean     DEFAULT false,
  created_at      timestamptz DEFAULT now()
);

-- Livestreams (admin-managed)
CREATE TABLE IF NOT EXISTS livestreams (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  title           text        NOT NULL,
  youtube_url     text        NOT NULL,
  youtube_live_id text,
  description     text,
  is_live         boolean     DEFAULT false,
  scheduled_at    timestamptz,
  created_at      timestamptz DEFAULT now()
);

-- Events / Calendar (admin-managed)
CREATE TABLE IF NOT EXISTS events (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  title           text        NOT NULL,
  description     text,
  start_time      timestamptz NOT NULL,
  end_time        timestamptz,
  location        text,
  created_at      timestamptz DEFAULT now()
);

-- ── Row Level Security ────────────────────────────────────────

ALTER TABLE plan_a_visit       ENABLE ROW LEVEL SECURITY;
ALTER TABLE connect_cards       ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests     ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE livestreams         ENABLE ROW LEVEL SECURITY;
ALTER TABLE events              ENABLE ROW LEVEL SECURITY;

-- Public can INSERT into form tables (no auth required)
CREATE POLICY "pav_public_insert"  ON plan_a_visit       FOR INSERT WITH CHECK (true);
CREATE POLICY "cc_public_insert"   ON connect_cards       FOR INSERT WITH CHECK (true);
CREATE POLICY "pr_public_insert"   ON prayer_requests     FOR INSERT WITH CHECK (true);
CREATE POLICY "cs_public_insert"   ON contact_submissions FOR INSERT WITH CHECK (true);

-- Public can read non-private prayer requests
CREATE POLICY "pr_public_select"   ON prayer_requests
  FOR SELECT USING (is_private = false);

-- Public can read livestreams and events
CREATE POLICY "ls_public_select"   ON livestreams FOR SELECT USING (true);
CREATE POLICY "ev_public_select"   ON events      FOR SELECT USING (true);

-- Authenticated (admin) has full access to everything
CREATE POLICY "pav_admin_all" ON plan_a_visit       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "cc_admin_all"  ON connect_cards       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "pr_admin_all"  ON prayer_requests     FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "cs_admin_all"  ON contact_submissions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "ls_admin_all"  ON livestreams         FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "ev_admin_all"  ON events              FOR ALL USING (auth.role() = 'authenticated');
