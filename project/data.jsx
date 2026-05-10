// Default seed content + persistence
const SEED_DATA = {
  meta: {
    name: "Avery J. Ramos",
    tagline: "Technical Writer & Documentation Engineer",
    location: "Portland, OR",
    edition: "Vol. VII · No. 142",
    motto: "All the docs that fit, we write.",
    foundedYear: 2017,
    logo: "logo.png",
  },
  portrait: { src: null, filter: "none", removedBg: false },
  bio: "Avery Ramos has spent the better part of a decade turning unruly engineering drafts into documentation that people actually finish reading. She specializes in API references, developer onboarding, and the un-glamorous craft of making complex systems feel inevitable. Previously at three startups you have probably used today; currently independent and accepting commissions.",
  whatIDo: "I produce software documentations:\n — Project Proposals\n — Project Plans\n — Business Requirements Document (BRD)\n — Product Requirements Document (PRD)\n — Software Requirement Document (SRS)\n — Functional Requirements Document (FRD)\n — Use Case Analysis\n — User Stories with Acceptance Criteria\n — Test Case Document\n\nMore, I draft Developer Guides, User Manuals, conceptual guides, and editorial systems for engineering teams. I run docs audits, set up content infrastructure, and ship the first draft myself.\n\nI also draft highly SEO‑optimized technical blogs & articles.",
  services: [
    { id: "s1", title: "API Reference Documentation", description: "OpenAPI-driven references with hand-tuned narrative. Endpoints, schemas, recipes." },
    { id: "s2", title: "Developer Guides & Tutorials", description: "Conceptual material, quickstarts, and end-to-end walkthroughs that reduce time-to-first-success." },
    { id: "s3", title: "Knowledge Base Architecture", description: "IA, taxonomy, and platform setup (Docusaurus, Mintlify, custom). Migration included." },
    { id: "s4", title: "Technical Editing", description: "Substantive editing for engineers who can write but don't have time. Voice, structure, accuracy." },
    { id: "s5", title: "Documentation Audits", description: "Coverage maps, gap analysis, and a six-month roadmap you can actually execute on." },
    { id: "s6", title: "Style Guides & Content Ops", description: "Voice & tone, terminology, review workflows, contribution guides for engineering teams." },
  ],
  samples: [
    {
      id: "w1",
      title: "Helios Payments — API Reference",
      kind: "API Reference",
      year: "2025",
      client: "Helios Payments",
      excerpt: "A 240-page reference rebuilt from a sprawling Postman collection. Reduced first-call time-to-success from 47 to 12 minutes.",
      tags: ["openapi", "rest", "fintech"],
      thumb: null,
      pdfPages: [
        { type: "title", title: "Helios Payments", subtitle: "API Reference, v3.2", date: "Q2 2025", author: "Documentation by A. Ramos" },
        { type: "toc", title: "Contents", entries: [
          ["I.", "Authentication & Onboarding", "12"],
          ["II.", "Payments", "34"],
          ["III.", "Payouts", "78"],
          ["IV.", "Webhooks", "104"],
          ["V.", "Errors & Idempotency", "138"],
          ["VI.", "Appendix: SDK Reference", "162"],
        ]},
        { type: "spec", endpoint: "POST /v3/payments", description: "Create a payment intent. Idempotency keys are required for all mutating requests.",
          fields: [["amount_cents","integer","required","Amount in the smallest currency unit"],["currency","string","required","ISO 4217 (3 letters)"],["customer_id","string","optional","Helios-issued identifier"],["metadata","object","optional","Up to 16 keys, ≤ 500 chars each"]]},
        { type: "prose", title: "Idempotency, plainly", body: "An idempotent request is one you can safely retry. Helios looks up your idempotency key for 24 hours; we either replay the original response or — if the original is still in flight — we wait. You will never charge a card twice for the same key. You will, however, charge it twice for two different keys; this is on you." },
      ],
    },
    {
      id: "w2",
      title: "Quartzdesk — Developer Quickstart",
      kind: "Developer Guide",
      year: "2025",
      client: "Quartzdesk Inc.",
      excerpt: "A four-chapter quickstart that takes a new developer from `npm install` to a deployed integration in under thirty minutes.",
      tags: ["onboarding", "saas", "tutorial"],
      thumb: null,
      pdfPages: [
        { type: "title", title: "Quartzdesk", subtitle: "The Thirty-Minute Quickstart", date: "Spring 2025" },
        { type: "prose", title: "Before you begin", body: "You will need a terminal, Node 20 or later, and a Quartzdesk account. If you do not have an account, create one — the free tier is enough for everything in this guide. We assume basic familiarity with npm and JavaScript; we do not assume you have ever used Quartzdesk before." },
        { type: "code", lang: "shell", lines: ["$ npm install @quartzdesk/sdk", "$ export QD_TOKEN=qd_test_•••••••","$ node hello.js","→ Connected. Workspace: \"acme-co\"."]},
          { type: "prose", title: "What you just did", body: "You authenticated to your workspace and made a single round-trip to the Quartzdesk control plane. The SDK cached your token in memory only — nothing was written to disk. In production you will want to use a secrets manager; we cover that in chapter four." },
      ],
    },
    {
      id: "w3",
      title: "Northwind Cloud — Migration Runbook",
      kind: "Runbook",
      year: "2024",
      client: "Northwind Cloud",
      excerpt: "An operational runbook covering a controlled migration from a self-managed Postgres cluster to Northwind's managed offering.",
      tags: ["ops", "runbook", "database"],
      thumb: null,
      pdfPages: [
        { type: "title", title: "Postgres → Northwind", subtitle: "Migration Runbook · Cohort 11", date: "Nov 2024" },
        { type: "prose", title: "Scope", body: "This runbook describes the supported migration path for clusters in the 12.x and 13.x series. Clusters with logical replication slots, custom extensions outside the supported list, or active 2PC transactions are out of scope and require a manual engagement." },
        { type: "checklist", title: "Pre-flight checklist", items: ["Read-replica lag < 30s for the past 24h","All extensions present in `northwind_supported_extensions.txt`","Maintenance window approved (≥ 4h)","Application-side retry policy is in place","On-call rotation acknowledged"] },
      ],
    },
    {
      id: "w4",
      title: "Iolite SDK — Conceptual Guide",
      kind: "Conceptual",
      year: "2024",
      client: "Iolite Labs",
      excerpt: "The narrative chapters that explain what an Iolite stream is, why it exists, and how it differs from the four other things people might call a stream.",
      tags: ["sdk", "narrative", "platform"],
      thumb: null,
      pdfPages: [
        { type: "title", title: "Iolite", subtitle: "A field guide to streams", date: "2024" },
        { type: "prose", title: "What is a stream?", body: "Iolite uses 'stream' to mean an ordered, append-only sequence of events with at-least-once delivery. This is not the same thing your message broker calls a stream, the same thing your reactive UI library calls a stream, or the same thing your favorite database calls a stream. Mostly we mean the first one. We use the word anyway, because the alternatives are worse." },
      ],
    },
    {
      id: "w5",
      title: "Pinecrest Health — Style Guide",
      kind: "Style Guide",
      year: "2024",
      client: "Pinecrest Health",
      excerpt: "A 60-page voice, tone, and terminology guide for a clinical software team. Distinguishes 'patient,' 'member,' and 'subject' across product surfaces.",
      tags: ["healthcare", "voice", "terminology"],
      thumb: null,
      pdfPages: [
        { type: "title", title: "Pinecrest Health", subtitle: "Editorial Style Guide", date: "Edition 2 · 2024" },
        { type: "prose", title: "On clarity", body: "Clinical software sits between practitioners under pressure and patients in distress. Our prose has one job: remove ambiguity. We choose the boring, specific word over the elegant, general one. We never sacrifice clarity for warmth, but we will sacrifice cleverness for either." },
      ],
    },
    {
      id: "w6",
      title: "Marlowe — Internal Engineering Wiki",
      kind: "Wiki / IA",
      year: "2023",
      client: "Marlowe (Series B)",
      excerpt: "Information architecture and seeded content for a 60-engineer internal wiki. Replaced six abandoned Notion workspaces.",
      tags: ["internal", "ia", "audit"],
      thumb: null,
      pdfPages: [
        { type: "title", title: "Marlowe", subtitle: "Engineering Wiki — IA Proposal", date: "2023" },
        { type: "toc", title: "Top-level structure", entries: [
          ["01", "How we work", "—"],
          ["02", "Systems & services", "—"],
          ["03", "On-call & incidents", "—"],
          ["04", "Decisions (ADRs)", "—"],
          ["05", "Glossary", "—"],
        ]},
      ],
    },
  ],
  process: [
    { step: "01", title: "Scope & audit", body: "We start with a 60-minute call and a read-through of what you have. I produce a one-page coverage map within the first week." },
    { step: "02", title: "Outline & sample", body: "Before any heavy writing, I deliver an outline plus one fully-written sample chapter for review. Cheap to throw away, expensive to skip." },
    { step: "03", title: "Drafts in flight", body: "Drafts ship in your repo or CMS, in your voice, against agreed style. Two review rounds per chapter is the default." },
    { step: "04", title: "Handoff & maintenance", body: "Final delivery includes a maintenance plan, a contributor guide, and (if you want) a quarterly retainer." },
  ],
  testimonials: [
    { quote: "Avery rewrote our reference docs in six weeks and our support volume dropped a third. We did not see that coming.", author: "Priya Mehta", role: "VP Engineering, Helios Payments" },
    { quote: "She is the only writer I have worked with who actually reads the source.", author: "Ben Okafor", role: "Staff Engineer, Iolite Labs" },
    { quote: "Worth every penny and then some. Hire before your competitors do.", author: "Lina Sørensen", role: "CTO, Quartzdesk" },
  ],
  contact: {
    email: "avery@ramos.docs",
    location: "Portland, OR · Remote-friendly",
    hours: "Mon–Thu, 09:00–17:00 PT",
    socials: [
      { label: "GitHub", handle: "@averyramos", url: "#" },
      { label: "LinkedIn", handle: "in/averyramos", url: "#" },
      { label: "Mastodon", handle: "@avery@writing.exchange", url: "#" },
      { label: "Reading list", handle: "ramos.docs/reading", url: "#" },
    ],
    rate: "Project & retainer · References on request",
    nextAvailable: "August 2026",
  },
};

const STORAGE_KEY = "documentarian.portfolio.v1";

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(SEED_DATA);
    const parsed = JSON.parse(raw);
    // Shallow merge so new fields show up
    return { ...structuredClone(SEED_DATA), ...parsed };
  } catch {
    return structuredClone(SEED_DATA);
  }
}

function saveData(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

function resetData() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

window.SEED_DATA = SEED_DATA;
window.loadData = loadData;
window.saveData = saveData;
window.resetData = resetData;
