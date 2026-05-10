-- ============================================================
-- Seed data — run AFTER schema.sql
-- Paste into Supabase Dashboard → SQL Editor
-- ============================================================

-- Site metadata
insert into site_meta (id, name, tagline, location, bio, what_i_do, logo_url)
values (1,
  'Avery J. Ramos',
  'Technical Writer & Documentation Engineer',
  'Portland, OR',
  'Avery Ramos has spent the better part of a decade turning unruly engineering drafts into documentation that people actually finish reading. She specializes in API references, developer onboarding, and the un-glamorous craft of making complex systems feel inevitable. Previously at three startups you have probably used today; currently independent and accepting commissions.',
  'I produce software documentations:
 — Project Proposals
 — Project Plans
 — Business Requirements Document (BRD)
 — Product Requirements Document (PRD)
 — Software Requirement Document (SRS)
 — Functional Requirements Document (FRD)
 — Use Case Analysis
 — User Stories with Acceptance Criteria
 — Test Case Document

More, I draft Developer Guides, User Manuals, conceptual guides, and editorial systems for engineering teams. I run docs audits, set up content infrastructure, and ship the first draft myself.

I also draft highly SEO‑optimized technical blogs & articles.',
  '/logo.png'
)
on conflict (id) do update set
  name = excluded.name, tagline = excluded.tagline, location = excluded.location,
  bio = excluded.bio, what_i_do = excluded.what_i_do, logo_url = excluded.logo_url;

-- Contact info
insert into contact_info (id, email, studio, hours, rate, next_available)
values (1,
  'avery@ramos.docs',
  'Portland, OR · Remote-friendly',
  'Mon–Thu, 09:00–17:00 PT',
  'Project & retainer · References on request',
  'August 2026'
)
on conflict (id) do update set
  email = excluded.email, studio = excluded.studio, hours = excluded.hours,
  rate = excluded.rate, next_available = excluded.next_available;

-- Services
insert into services (title, description, display_order) values
  ('API Reference Documentation',  'OpenAPI-driven references with hand-tuned narrative. Endpoints, schemas, recipes.',                                             0),
  ('Developer Guides & Tutorials', 'Conceptual material, quickstarts, and end-to-end walkthroughs that reduce time-to-first-success.',                              1),
  ('Knowledge Base Architecture',  'IA, taxonomy, and platform setup (Docusaurus, Mintlify, custom). Migration included.',                                          2),
  ('Technical Editing',            'Substantive editing for engineers who can write but don''t have time. Voice, structure, accuracy.',                              3),
  ('Documentation Audits',         'Coverage maps, gap analysis, and a six-month roadmap you can actually execute on.',                                             4),
  ('Style Guides & Content Ops',   'Voice & tone, terminology, review workflows, contribution guides for engineering teams.',                                        5)
on conflict do nothing;

-- Samples (no PDFs uploaded yet — add them via the admin panel)
insert into samples (title, kind, year, client, excerpt, tags, display_order) values
  ('Helios Payments — API Reference',      'API Reference',   '2025', 'Helios Payments',  'A 240-page reference rebuilt from a sprawling Postman collection. Reduced first-call time-to-success from 47 to 12 minutes.',                                                           array['openapi','rest','fintech'],           0),
  ('Quartzdesk — Developer Quickstart',    'Developer Guide', '2025', 'Quartzdesk Inc.',  'A four-chapter quickstart that takes a new developer from `npm install` to a deployed integration in under thirty minutes.',                                                           array['onboarding','saas','tutorial'],       1),
  ('Northwind Cloud — Migration Runbook',  'Runbook',         '2024', 'Northwind Cloud',  'An operational runbook covering a controlled migration from a self-managed Postgres cluster to Northwind''s managed offering.',                                                         array['ops','runbook','database'],           2),
  ('Iolite SDK — Conceptual Guide',        'Conceptual',      '2024', 'Iolite Labs',      'The narrative chapters that explain what an Iolite stream is, why it exists, and how it differs from the four other things people might call a stream.',                               array['sdk','narrative','platform'],         3),
  ('Pinecrest Health — Style Guide',       'Style Guide',     '2024', 'Pinecrest Health', 'A 60-page voice, tone, and terminology guide for a clinical software team. Distinguishes ''patient,'' ''member,'' and ''subject'' across product surfaces.',                           array['healthcare','voice','terminology'],    4),
  ('Marlowe — Internal Engineering Wiki',  'Wiki / IA',       '2023', 'Marlowe (Series B)','Information architecture and seeded content for a 60-engineer internal wiki. Replaced six abandoned Notion workspaces.',                                                              array['internal','ia','audit'],              5)
on conflict do nothing;

-- Process steps
insert into process_steps (step_number, title, body, display_order) values
  ('01', 'Scope & audit',        'We start with a 60-minute call and a read-through of what you have. I produce a one-page coverage map within the first week.',                                        0),
  ('02', 'Outline & sample',     'Before any heavy writing, I deliver an outline plus one fully-written sample chapter for review. Cheap to throw away, expensive to skip.',                           1),
  ('03', 'Drafts in flight',     'Drafts ship in your repo or CMS, in your voice, against agreed style. Two review rounds per chapter is the default.',                                               2),
  ('04', 'Handoff & maintenance','Final delivery includes a maintenance plan, a contributor guide, and (if you want) a quarterly retainer.',                                                           3)
on conflict do nothing;

-- Testimonials
insert into testimonials (quote, author, role, display_order) values
  ('Avery rewrote our reference docs in six weeks and our support volume dropped a third. We did not see that coming.',  'Priya Mehta',    'VP Engineering, Helios Payments', 0),
  ('She is the only writer I have worked with who actually reads the source.',                                           'Ben Okafor',     'Staff Engineer, Iolite Labs',      1),
  ('Worth every penny and then some. Hire before your competitors do.',                                                  'Lina Sørensen',  'CTO, Quartzdesk',                  2)
on conflict do nothing;

-- Social links
insert into socials (label, handle, url, display_order) values
  ('GitHub',       '@averyramos',              '#', 0),
  ('LinkedIn',     'in/averyramos',            '#', 1),
  ('Mastodon',     '@avery@writing.exchange',  '#', 2),
  ('Reading list', 'ramos.docs/reading',       '#', 3)
on conflict do nothing;
