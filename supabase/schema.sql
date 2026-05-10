-- ============================================================
-- Documentarian Portfolio — Supabase Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";


-- ── Tables ────────────────────────────────────────────────────────────────────

-- Site metadata (always one row, id = 1)
create table if not exists site_meta (
  id            integer primary key default 1,
  name          text    not null default 'Your Name',
  tagline       text    default 'Your Professional Title',
  location      text    default 'Your City',
  bio           text    default '',
  what_i_do     text    default '',
  portrait_url  text,
  portrait_filter text  default 'none',
  logo_url      text    default '/logo.png',
  constraint site_meta_single_row check (id = 1)
);

-- Contact info (always one row, id = 1)
create table if not exists contact_info (
  id             integer primary key default 1,
  email          text    default '',
  studio         text    default '',
  hours          text    default '',
  rate           text    default '',
  next_available text    default '',
  constraint contact_info_single_row check (id = 1)
);

-- Services offered
create table if not exists services (
  id            uuid    primary key default gen_random_uuid(),
  title         text    not null,
  description   text    default '',
  display_order integer default 0,
  created_at    timestamptz default now()
);

-- Work samples
create table if not exists samples (
  id            uuid    primary key default gen_random_uuid(),
  title         text    not null,
  kind          text    default '',
  year          text    default '',
  client        text    default '',
  excerpt       text    default '',
  tags          text[]  default '{}',
  thumb_url     text,
  pdf_url       text,
  display_order integer default 0,
  created_at    timestamptz default now()
);

-- How-I-work process steps
create table if not exists process_steps (
  id            uuid    primary key default gen_random_uuid(),
  step_number   text    default '',
  title         text    not null,
  body          text    default '',
  display_order integer default 0
);

-- Client testimonials
create table if not exists testimonials (
  id            uuid    primary key default gen_random_uuid(),
  quote         text    not null,
  author        text    default '',
  role          text    default '',
  display_order integer default 0
);

-- Social / elsewhere links
create table if not exists socials (
  id            uuid    primary key default gen_random_uuid(),
  label         text    default '',
  handle        text    default '',
  url           text    default '#',
  display_order integer default 0
);

-- Contact form submissions (write-only for public, read by admin)
create table if not exists contact_submissions (
  id               uuid    primary key default gen_random_uuid(),
  name             text,
  email            text,
  company          text,
  service_interest text,
  message          text,
  read             boolean default false,
  created_at       timestamptz default now()
);


-- ── Row-Level Security ────────────────────────────────────────────────────────

alter table site_meta           enable row level security;
alter table contact_info        enable row level security;
alter table services            enable row level security;
alter table samples             enable row level security;
alter table process_steps       enable row level security;
alter table testimonials        enable row level security;
alter table socials             enable row level security;
alter table contact_submissions enable row level security;

-- Public can read all portfolio data
create policy "Public read" on site_meta           for select using (true);
create policy "Public read" on contact_info        for select using (true);
create policy "Public read" on services            for select using (true);
create policy "Public read" on samples             for select using (true);
create policy "Public read" on process_steps       for select using (true);
create policy "Public read" on testimonials        for select using (true);
create policy "Public read" on socials             for select using (true);

-- Public can submit contact form
create policy "Public insert" on contact_submissions for insert with check (true);

-- Authenticated (admin) can do everything
create policy "Auth all" on site_meta           for all using (auth.role() = 'authenticated');
create policy "Auth all" on contact_info        for all using (auth.role() = 'authenticated');
create policy "Auth all" on services            for all using (auth.role() = 'authenticated');
create policy "Auth all" on samples             for all using (auth.role() = 'authenticated');
create policy "Auth all" on process_steps       for all using (auth.role() = 'authenticated');
create policy "Auth all" on testimonials        for all using (auth.role() = 'authenticated');
create policy "Auth all" on socials             for all using (auth.role() = 'authenticated');
create policy "Auth all" on contact_submissions for all using (auth.role() = 'authenticated');


-- ── Storage Buckets ───────────────────────────────────────────────────────────
-- Run this section separately if the main block errors on storage permissions

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('pdfs',       'pdfs',       true, 52428800,  array['application/pdf']),
  ('thumbnails', 'thumbnails', true, 10485760,  array['image/jpeg','image/png','image/webp','image/gif']),
  ('portraits',  'portraits',  true, 10485760,  array['image/jpeg','image/png','image/webp','image/png'])
on conflict (id) do nothing;

-- Public can read files from all three buckets
create policy "Public read storage" on storage.objects
  for select using (bucket_id in ('pdfs', 'thumbnails', 'portraits'));

-- Authenticated users can upload/update/delete in all three buckets
create policy "Auth manage storage" on storage.objects
  for all using (bucket_id in ('pdfs', 'thumbnails', 'portraits') and auth.role() = 'authenticated')
  with check (bucket_id in ('pdfs', 'thumbnails', 'portraits') and auth.role() = 'authenticated');
