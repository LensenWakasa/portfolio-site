# Lensen Wakasa Portfolio — Deployment & User Manual

## Overview

This is a Next.js 16 portfolio site with a dark editorial aesthetic (deep bronze on near-black). It features projects, research papers, blog posts, a vision page, an about page, and a password-protected admin CMS.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Database | Supabase Postgres (via Drizzle ORM + `pg`) |
| Styling | Tailwind CSS v4 |
| Fonts | Playfair Display (headlines), Source Serif 4 (body), JetBrains Mono (labels) |
| Auth | HMAC-signed cookie sessions (Web Crypto API) |

---

## Environment Variables

Create a `.env.local` file at the project root with these variables:

```bash
# Database (Supabase or any Postgres)
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres

# Admin auth
ADMIN_PASSWORD=your-secure-password-here
SESSION_SECRET=minimum-32-character-random-string-here

# Optional: Vercel Analytics (auto-injected on Vercel)
# No other env vars required for core functionality
```

### Getting your DATABASE_URL from Supabase

1. Go to [supabase.com](https://supabase.com) and open your project
2. Click **Settings** → **Database**
3. Under **Connection string**, copy the **URI** format
4. Replace `[YOUR-PASSWORD]` with your database password

---

## Database Setup

The schema is defined in `lib/db/schema.ts`. You need three tables: `projects`, `papers`, `posts`.

### Option A: Using Drizzle (recommended)

If you have `drizzle-kit` set up, run migrations. Otherwise, run the SQL directly in your Supabase SQL Editor:

```sql
-- Run this in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  tags TEXT[] NOT NULL DEFAULT '{}',
  link TEXT,
  cover_url TEXT,
  year TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS papers (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  abstract TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  authors TEXT NOT NULL DEFAULT '',
  venue TEXT,
  year TEXT,
  link TEXT,
  pdf_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  year TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tags TEXT[] NOT NULL DEFAULT '{}',
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Seeding sample data

After creating tables, you can seed data via the admin panel or by inserting directly:

```sql
INSERT INTO projects (slug, title, summary, content, status, tags, year, featured, sort_order) VALUES
('soma', 'SOMA', 'Selective cOgnitive Memory Architecture', 'SOMA routes new tasks to fast-changing adapters while consolidating old knowledge into slow, frozen representations.', 'active', ARRAY['Continual Learning', 'Cognitive Architectures'], '2024–2026', true, 0);

INSERT INTO papers (slug, title, abstract, authors, venue, year, tags) VALUES
('soma-v1', 'SOMA v1: Adapter Routing for Continual Learning', 'We introduce SOMA, a selective cognitive memory architecture...', 'Lensen Wakasa', 'Working Paper', '2025', ARRAY['Continual Learning']);

INSERT INTO posts (slug, title, excerpt, content, year, tags) VALUES
('why-continual', 'Why I am Betting on Continual Learning', 'Every time you fine-tune a model, it forgets.', 'Continual learning is the most important open problem in AI...', '2025', ARRAY['AI']);
```

---

## Local Development

```bash
# Install dependencies
npm install

# Set up env vars
cp .env.local.example .env.local
# → Edit .env.local with your values

# Run dev server
npm run dev
# → http://localhost:3000
```

---

## Deploying to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOURNAME/portfolio.git
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and create a new project
2. Import your GitHub repository
3. Set the framework preset to **Next.js**
4. Add environment variables in the Vercel dashboard:
   - `DATABASE_URL`
   - `ADMIN_PASSWORD`
   - `SESSION_SECRET`
5. Deploy

### Step 3: Post-deploy setup

1. Visit `/admin/login`
2. Enter your `ADMIN_PASSWORD`
3. Add content via the admin dashboard:
   - `/admin/projects` → Add projects
   - `/admin/papers` → Add papers
   - `/admin/posts` → Add posts

---

## Admin CMS Guide

### Logging In

Navigate to `/admin/login` and enter your admin password. You'll be redirected to the dashboard.

### Dashboard

The dashboard shows counts for:
- Projects
- Papers
- Posts
- Total views across all content

### Managing Content

Each content type (Projects, Papers, Posts) has:
- **List page** — See all items, edit or delete
- **New page** — Create new item with a form
- **Edit page** — Modify existing item

### Content Fields

**Projects:**
- `slug` — URL-friendly identifier (e.g., `soma`)
- `title` — Display name
- `summary` — Short description shown on cards
- `content` — Full long-form write-up (supports markdown-like formatting)
- `status` — `active`, `building`, `research`, or `revenue` (shown as colored chip)
- `tags` — Array of labels
- `link` — External URL (GitHub, demo)
- `cover_url` — Thumbnail image URL
- `year` — Display year
- `featured` — Show on homepage
- `sort_order` — Manual ordering

**Papers:**
- `slug`, `title`, `abstract`, `content`
- `authors` — Comma-separated
- `venue` — Conference or journal
- `year`
- `link` — arXiv/DOI URL
- `pdf_url` — PDF link
- `tags`, `sort_order`

**Posts:**
- `slug`, `title`, `excerpt`, `content`
- `year`, `tags`

### Content Body Formatting

The reader modal supports basic formatting in content fields:

```
# Heading 1
## Heading 2
### Heading 3

**bold text**
*italic text*
`code inline`

> Blockquote paragraph

- List item 1
- List item 2

1. Ordered item 1
2. Ordered item 2

[Link text](https://example.com)

--- (horizontal rule)
```

---

## Features Reference

| Feature | How It Works |
|---------|-------------|
| **View Counters** | Stored in DB, incremented once per visitor per 24h via cookie |
| **Search** | Press `Cmd+K` (or click search icon) to search across all content |
| **Dark/Light Mode** | Toggle in nav, persisted in localStorage |
| **Modal Reader** | Click any content card to open full content in a modal |
| **Status Chips** | Projects show colored status badges (active/building/research/revenue) |
| **Thumbnails** | Set `cover_url` on projects to show images on cards and in reader |

---

## Customization

### Changing Colors

Edit `app/globals.css` — the theme uses CSS custom properties:

```css
:root {
  --primary: #C8963E;     /* Bronze accent */
  --background: #0A0804;  /* Near-black */
  --foreground: #F5EDD6;  /* Cream text */
}
```

### Changing Fonts

Edit `app/layout.tsx` — fonts load via `next/font/google`.

### Profile Photo

Replace `public/images/image.png` with your own photo. It displays on the About page.

---

## Troubleshooting

**Build fails with "ECONNREFUSED 127.0.0.1:5432"**
→ The build tries to query the DB during static generation. This is expected in CI. The site uses `dynamic = "force-dynamic"` on all data-fetching pages, so it will work at runtime.

**"Unauthorized" on admin API routes**
→ Your session cookie expired. Log out and log in again.

**Images not loading**
→ The site uses `next.config.mjs` with `images.unoptimized: true`. For production with Vercel, you can remove this line to enable Next.js image optimization.

**Theme flash on load**
→ An inline script in `app/layout.tsx` sets the theme before React hydrates. If you see a flash, check that the script is present in the HTML `<head>`.

---

## File Structure

```
app/
  page.tsx              # Homepage (hero + featured content)
  projects/page.tsx     # Projects listing
  papers/page.tsx       # Papers listing
  writing/page.tsx      # Posts listing
  vision/page.tsx       # Vision page
  about/page.tsx        # About page
  admin/                # Admin CMS
    login/page.tsx      # Login form
    page.tsx            # Dashboard
    projects/           # Project CRUD
    papers/             # Paper CRUD
    posts/              # Post CRUD
    components/         # Reusable form fields
  api/admin/            # Admin API routes
    login/route.ts
    logout/route.ts
    projects/route.ts
    projects/[id]/route.ts
    papers/route.ts
    papers/[id]/route.ts
    posts/route.ts
    posts/[id]/route.ts
components/
  site-nav.tsx          # Navigation bar
  site-footer.tsx       # Footer
  content-card.tsx      # Content cards (projects/papers/posts)
  reader-context.tsx    # Modal reader
  search-dialog.tsx     # Search modal
  theme-toggle.tsx      # Dark/light toggle
  starfield-hero.tsx    # Canvas starfield animation
  page-header.tsx       # Page header component
lib/
  db/
    index.ts            # Drizzle client
    schema.ts           # Database schema
  data.ts               # Data fetching functions
  map.ts                # Type mappers
  auth.ts               # Session/auth utilities
  api-auth.ts           # API route auth guard
```

---

*Last updated: June 2026 — Wakasa Labs*
