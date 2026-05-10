# Setup Guide

## Prerequisites

- Node.js 18+ installed
- A free [Supabase](https://supabase.com) account

---

## 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New project**
3. Choose a name, set a strong database password, and pick the region closest to you
4. Wait ~2 minutes for provisioning

---

## 2. Get your API credentials

In the Supabase dashboard, go to **Settings → API** and copy:

- **Project URL** — looks like `https://abcdefgh.supabase.co`
- **anon / public key** — the long `eyJ...` string under "Project API keys"

---

## 3. Configure the app

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 4. Run the database schema

In the Supabase dashboard, go to **SQL Editor** and click **New query**.

Copy the entire contents of `supabase/schema.sql`, paste it in, and click **Run**.

This creates all tables, enables Row-Level Security, and sets up storage buckets.

---

## 5. Seed default content

Still in the SQL Editor, open another **New query**.

Copy the entire contents of `supabase/seed.sql`, paste it in, and click **Run**.

This populates your portfolio with the starter content (edit it in the admin panel later).

---

## 6. Create your admin account

1. In the Supabase dashboard, go to **Authentication → Users**
2. Click **Add user → Create new user**
3. Enter your email and a secure password
4. Click **Create user**

This is the account you'll use to log into the admin panel.

---

## 7. Install dependencies and start the dev server

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 8. Access the admin panel

The admin panel is hidden — there's no visible link. To open it:

- **Triple-click** your name in the masthead (top of the page), **or**
- Click the **"Editor"** text in the footer

Sign in with the email and password you created in Step 6.

---

## Admin panel tabs

| Tab | What you can do |
|-----|-----------------|
| **Samples** | Add/edit/delete work samples, upload PDFs and thumbnails, reorder |
| **About** | Edit your name, bio, portrait photo, CSS filter style |
| **Services** | Edit the services you offer |
| **Contact** | Edit contact details, social links |
| **Messages** | Read contact form submissions |
| **Danger** | Delete all samples (irreversible) |

---

## Deploying to production

### Option A: Vercel (recommended)

```bash
npm install -g vercel
vercel
```

When prompted, add your environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Option B: Netlify

```bash
npm run build
# Deploy the dist/ folder via Netlify drag-and-drop or CLI
```

Set the same two environment variables in Netlify → Site settings → Environment variables.

### Option C: Any static host

```bash
npm run build
# Upload the dist/ folder to your host
```

---

## Customising your portfolio

Everything is editable through the admin panel without touching code. For deeper changes:

| What | Where |
|------|-------|
| Color palette, fonts, spacing | `src/styles/global.css` |
| Default palette / density on load | `src/App.jsx` (body dataset attributes) |
| Number of columns in samples grid | `src/sections/` section components |
| PDF viewer page size | `src/components/PDFViewer.jsx` |
