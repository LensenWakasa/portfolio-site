# Lensen Wakasa — Portfolio Engineering Specification

**Version:** 1.0  
**Author:** Lensen Wakasa / Wakasa Labs  
**Stack:** Next.js 14 (App Router) · Vercel Postgres · Vercel Blob · Tailwind CSS  
**Repository:** `github.com/lensenwakasa/portfolio` (create this)  
**Deployment:** Vercel (free Hobby tier covers all of this)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Diagram](#2-architecture-diagram)
3. [Tech Stack & Rationale](#3-tech-stack--rationale)
4. [Repository Structure](#4-repository-structure)
5. [Database Schema](#5-database-schema)
6. [API Routes](#6-api-routes)
7. [Page & Component Map](#7-page--component-map)
8. [Feature Specifications](#8-feature-specifications)
9. [Media & Upload System](#9-media--upload-system)
10. [Socials & Third-Party Integrations](#10-socials--third-party-integrations)
11. [Authentication & Admin](#11-authentication--admin)
12. [Design System](#12-design-system)
13. [Environment Variables](#13-environment-variables)
14. [Deployment Checklist](#14-deployment-checklist)
15. [Development Setup](#15-development-setup)
16. [Future Roadmap](#16-future-roadmap)

---

## 1. Project Overview

### Purpose

A personal portfolio and research hub for Lensen Wakasa — AI researcher, founder of Wakasa Labs, and medic-in-training. The site serves four audiences simultaneously:

- **Potential collaborators / researchers** — want to see SOMA papers, architecture depth, citation-ready work
- **Potential employers / grant reviewers** — want credibility signals: projects, publications, timeline
- **General audience / social** — want personality, writing, music taste, the person behind the work
- **Lensen himself** — needs a CMS-like admin interface to publish posts, upload images, track view counts

### Core Features

| Feature | Description |
|---|---|
| **Projects** | Full CRUD — name, description, status, tags, thumbnail, GitHub link, view counter |
| **Research / Papers** | Papers with abstracts, venue, authors, PDF upload, view counter |
| **Blog / Writing** | Rich posts with thumbnail images, SVG animation support inline, read time auto-calc |
| **About Section** | Profile photo upload, bio, background timeline, skills |
| **View Counters** | Per-content view tracking stored in Postgres, shared across all visitors |
| **Search** | Full-text search across projects, papers, posts |
| **Socials** | Twitter/X, Instagram, Spotify Now Playing widget, YouTube channel link |
| **Dark / Light Mode** | Persisted via localStorage + cookie for SSR |
| **Admin Panel** | Password-protected dashboard at `/admin` for all content management |
| **Image Uploads** | Profile photo, post thumbnails, project screenshots → Vercel Blob |
| **Inline SVG Animations** | Posts support embedded SVG with `<animate>` / CSS for motion |
| **NASA Hero** | Full-viewport spacecraft image (public domain) + canvas starfield |

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    VERCEL EDGE NETWORK                   │
├──────────────────┬──────────────────┬────────────────────┤
│   Next.js 14     │  Vercel Postgres  │   Vercel Blob      │
│   App Router     │  (Neon under     │   (image/file      │
│   (SSR + RSC)    │   the hood)      │    storage)        │
│                  │                  │                    │
│  /app            │  Tables:         │  Buckets:          │
│  ├── page.tsx    │  - projects      │  - profile/        │
│  ├── about/      │  - papers        │  - thumbnails/     │
│  ├── projects/   │  - posts         │  - pdfs/           │
│  ├── research/   │  - views         │  - project-imgs/   │
│  ├── blog/       │  - tags          │                    │
│  ├── vision/     │  - post_tags     │                    │
│  ├── admin/      │  - media         │                    │
│  └── api/        │                  │                    │
│      ├── views/  │                  │                    │
│      ├── upload/ │                  │                    │
│      ├── posts/  │                  │                    │
│      ├── search/ │                  │                    │
│      └── spotify/│                  │                    │
└──────────────────┴──────────────────┴────────────────────┘
         │                    │
         ▼                    ▼
   Spotify Web API      Cloudinary CDN
   (Now Playing)        (optional backup
                         for images)
```

### Data Flow

```
Browser Request
     │
     ▼
Next.js App Router (Edge/Node runtime)
     │
     ├── Server Components → fetch from Vercel Postgres directly (server-side, no API hop)
     ├── Client Components → fetch from /api/* routes
     └── Admin routes → check session cookie → redirect if unauth
```

---

## 3. Tech Stack & Rationale

| Layer | Choice | Why |
|---|---|---|
| **Framework** | Next.js 14 App Router | SSR for SEO, RSC for DB queries without API overhead, file-based routing |
| **Database** | Vercel Postgres (Neon) | Free tier, serverless-native, integrates with `@vercel/postgres` SDK in one line, lives on Vercel dashboard |
| **File Storage** | Vercel Blob | Native to Vercel, handles image uploads, PDFs; free 1GB included |
| **Styling** | Tailwind CSS + CSS Variables | Utility-first, easy dark mode via `dark:` prefix |
| **Fonts** | Google Fonts (Playfair Display, Source Serif 4, JetBrains Mono) | Editorial feel, loads via `next/font/google` |
| **Auth** | `iron-session` (cookie-based) | Minimal deps, no OAuth complexity needed for single-admin use |
| **Spotify** | Spotify Web API + PKCE | Now Playing widget; token stored in env var |
| **Image Opt** | `next/image` | Automatic WebP conversion, lazy loading, blur placeholder |
| **Markdown** | `next-mdx-remote` | Allows MDX in posts = React components (including SVG animations) inside blog content |
| **Search** | Postgres `tsvector` full-text | Built-in, zero extra service, fast enough for this scale |
| **Icons** | `lucide-react` | Tree-shakeable, consistent |
| **OG Images** | `@vercel/og` | Auto-generates social preview images per post/paper |

---

## 4. Repository Structure

```
lensen-portfolio/
├── app/
│   ├── layout.tsx                    # Root layout: fonts, theme, nav, footer
│   ├── page.tsx                      # Home (hero + featured content)
│   ├── about/
│   │   └── page.tsx
│   ├── projects/
│   │   ├── page.tsx                  # Projects list
│   │   └── [slug]/
│   │       └── page.tsx              # Individual project page
│   ├── research/
│   │   ├── page.tsx                  # Papers list
│   │   └── [slug]/
│   │       └── page.tsx              # Individual paper page
│   ├── blog/
│   │   ├── page.tsx                  # Posts list
│   │   └── [slug]/
│   │       └── page.tsx              # Individual post (MDX renderer)
│   ├── vision/
│   │   └── page.tsx
│   ├── admin/
│   │   ├── layout.tsx                # Auth guard wrapper
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── page.tsx                  # Admin dashboard (analytics overview)
│   │   ├── projects/
│   │   │   ├── page.tsx              # List + delete
│   │   │   ├── new/page.tsx          # Create form
│   │   │   └── [id]/edit/page.tsx    # Edit form
│   │   ├── papers/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   └── posts/
│   │       ├── page.tsx
│   │       ├── new/page.tsx          # MDX editor + image upload
│   │       └── [id]/edit/page.tsx
│   └── api/
│       ├── views/
│       │   └── route.ts              # GET/POST view counts
│       ├── upload/
│       │   └── route.ts              # POST → Vercel Blob
│       ├── search/
│       │   └── route.ts              # GET ?q=... → full-text search
│       ├── spotify/
│       │   └── route.ts              # GET current playing track
│       ├── admin/
│       │   ├── login/route.ts
│       │   └── logout/route.ts
│       ├── projects/
│       │   ├── route.ts              # GET list, POST create
│       │   └── [id]/route.ts         # GET one, PATCH update, DELETE
│       ├── papers/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       └── posts/
│           ├── route.ts
│           └── [id]/route.ts
│
├── components/
│   ├── layout/
│   │   ├── Nav.tsx
│   │   ├── Footer.tsx
│   │   └── ThemeProvider.tsx
│   ├── hero/
│   │   ├── HeroSection.tsx           # NASA image + star canvas
│   │   └── StarCanvas.tsx            # Animated star particles
│   ├── content/
│   │   ├── ProjectCard.tsx
│   │   ├── PaperRow.tsx
│   │   ├── PostCard.tsx
│   │   └── ViewCounter.tsx           # Client component: fetches + increments
│   ├── ui/
│   │   ├── Tag.tsx
│   │   ├── StatusChip.tsx
│   │   ├── SearchBar.tsx
│   │   ├── Modal.tsx
│   │   ├── ImageUpload.tsx           # Drag-and-drop upload widget
│   │   └── MdxRenderer.tsx           # next-mdx-remote + custom components
│   ├── socials/
│   │   ├── SpotifyWidget.tsx         # Now Playing
│   │   └── SocialLinks.tsx
│   └── admin/
│       ├── ContentForm.tsx           # Shared form shell
│       ├── TagInput.tsx
│       ├── MdxEditor.tsx             # Textarea + preview toggle
│       └── AnalyticsDashboard.tsx
│
├── lib/
│   ├── db.ts                         # Vercel Postgres client + typed query helpers
│   ├── auth.ts                       # iron-session config + getSession helper
│   ├── blob.ts                       # Vercel Blob upload helper
│   ├── spotify.ts                    # Spotify API token refresh + now-playing
│   ├── search.ts                     # Full-text search query builder
│   └── utils.ts                      # slugify, readTime, formatDate, cn()
│
├── types/
│   └── index.ts                      # Project, Paper, Post, Tag, ViewCount types
│
├── public/
│   ├── nasa-hero.jpg                 # Shuttle Endeavour silhouette (public domain)
│   └── og-default.jpg
│
├── styles/
│   └── globals.css                   # CSS variables, base styles, dark mode
│
├── middleware.ts                     # Protects /admin/* routes
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── .env.local                        # See §13
```

---

## 5. Database Schema

### Setup

Run these in the Vercel Postgres console (Storage → your DB → Query).

```sql
-- ── Extensions ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Tags ────────────────────────────────────────────────────────────────────
CREATE TABLE tags (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL UNIQUE,
  slug       TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Projects ────────────────────────────────────────────────────────────────
CREATE TABLE projects (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  full_name     TEXT,                        -- e.g. "Selective cOgnitive Memory Architecture"
  status        TEXT NOT NULL DEFAULT 'active', -- active | building | research | revenue
  year          TEXT,                        -- e.g. "2025–2026"
  description   TEXT NOT NULL,
  thumbnail_url TEXT,                        -- Vercel Blob URL
  github_url    TEXT,
  demo_url      TEXT,
  published     BOOLEAN DEFAULT TRUE,
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  search_vector TSVECTOR
);

CREATE INDEX projects_search_idx ON projects USING GIN(search_vector);
CREATE INDEX projects_slug_idx ON projects(slug);

-- Auto-update search_vector
CREATE OR REPLACE FUNCTION update_project_search()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.full_name, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER project_search_update
  BEFORE INSERT OR UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_project_search();

-- Project ↔ Tag join
CREATE TABLE project_tags (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  tag_id     UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, tag_id)
);

-- ── Papers ───────────────────────────────────────────────────────────────────
CREATE TABLE papers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          TEXT NOT NULL UNIQUE,
  title         TEXT NOT NULL,
  venue         TEXT,                        -- e.g. "Working Paper", "NeurIPS Workshop 2026"
  authors       TEXT NOT NULL,
  year          TEXT,
  status        TEXT,                        -- e.g. "targeting arXiv", "submitted"
  abstract      TEXT,
  pdf_url       TEXT,                        -- Vercel Blob URL
  arxiv_url     TEXT,
  doi_url       TEXT,
  published     BOOLEAN DEFAULT TRUE,
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  search_vector TSVECTOR
);

CREATE INDEX papers_search_idx ON papers USING GIN(search_vector);
CREATE INDEX papers_slug_idx ON papers(slug);

CREATE OR REPLACE FUNCTION update_paper_search()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.authors, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.abstract, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER paper_search_update
  BEFORE INSERT OR UPDATE ON papers
  FOR EACH ROW EXECUTE FUNCTION update_paper_search();

CREATE TABLE paper_tags (
  paper_id UUID REFERENCES papers(id) ON DELETE CASCADE,
  tag_id   UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (paper_id, tag_id)
);

-- ── Posts (Blog) ─────────────────────────────────────────────────────────────
CREATE TABLE posts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  excerpt         TEXT,
  content         TEXT NOT NULL,             -- MDX source string
  thumbnail_url   TEXT,                      -- Vercel Blob URL
  read_time       INTEGER,                   -- minutes, auto-calculated on save
  published       BOOLEAN DEFAULT FALSE,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  search_vector   TSVECTOR
);

CREATE INDEX posts_search_idx ON posts USING GIN(search_vector);
CREATE INDEX posts_slug_idx ON posts(slug);
CREATE INDEX posts_published_idx ON posts(published, published_at DESC);

CREATE OR REPLACE FUNCTION update_post_search()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.content, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_search_update
  BEFORE INSERT OR UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_post_search();

CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id  UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- ── Views ────────────────────────────────────────────────────────────────────
-- Tracks view counts per content item (content_type: project | paper | post)
CREATE TABLE views (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type TEXT NOT NULL,               -- 'project' | 'paper' | 'post'
  content_id   UUID NOT NULL,
  count        INTEGER NOT NULL DEFAULT 0,
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(content_type, content_id)
);

CREATE INDEX views_content_idx ON views(content_type, content_id);

-- ── Media ────────────────────────────────────────────────────────────────────
-- Tracks all uploaded files for the media library
CREATE TABLE media (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename     TEXT NOT NULL,
  blob_url     TEXT NOT NULL,
  content_type TEXT NOT NULL,               -- 'image/jpeg' | 'application/pdf' etc.
  size_bytes   INTEGER,
  alt_text     TEXT,
  uploaded_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Profile ──────────────────────────────────────────────────────────────────
-- Single-row config table (use UPSERT, never INSERT a second row)
CREATE TABLE profile (
  id             INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  display_name   TEXT DEFAULT 'Lensen Wakasa',
  bio_short      TEXT,
  bio_long       TEXT,
  avatar_url     TEXT,
  location       TEXT DEFAULT 'Nakuru, Kenya',
  email          TEXT,
  twitter_handle TEXT DEFAULT 'LensenWakasa',
  instagram_handle TEXT DEFAULT 'lensenwakasa',
  github_handle  TEXT,
  youtube_url    TEXT,
  spotify_profile_url TEXT,
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Seed the profile row
INSERT INTO profile (id) VALUES (1) ON CONFLICT DO NOTHING;

-- ── Seed data ────────────────────────────────────────────────────────────────
INSERT INTO tags (name, slug) VALUES
  ('Continual Learning', 'continual-learning'),
  ('Cognitive Architectures', 'cognitive-architectures'),
  ('AI for Science', 'ai-for-science'),
  ('Computational Biology', 'computational-biology'),
  ('Adapter Routing', 'adapter-routing'),
  ('Multi-Scale Training', 'multi-scale-training'),
  ('PyTorch', 'pytorch'),
  ('EdTech', 'edtech'),
  ('Kenya', 'kenya'),
  ('Quant Finance', 'quant-finance')
ON CONFLICT DO NOTHING;
```

---

## 6. API Routes

All routes live under `app/api/`. Every route returns JSON. Admin-only routes check the session cookie first.

### `GET /api/views?type=project&id=<uuid>`
Returns `{ count: number }` for a given content item.

### `POST /api/views`
Body: `{ type: "project"|"paper"|"post", id: string }`  
Upserts a view record, incrementing count. Returns `{ count: number }`.  
**Rate limiting:** Use Vercel Edge Config or a simple IP-based `Map` in memory to avoid bots inflating counts. Alternatively, set a cookie so each browser only counts once per 24h.

```typescript
// app/api/views/route.ts
import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { type, id } = await req.json();
  if (!type || !id) return NextResponse.json({ error: 'Missing params' }, { status: 400 });

  const result = await sql`
    INSERT INTO views (content_type, content_id, count)
    VALUES (${type}, ${id}::uuid, 1)
    ON CONFLICT (content_type, content_id)
    DO UPDATE SET count = views.count + 1, updated_at = NOW()
    RETURNING count
  `;
  return NextResponse.json({ count: result.rows[0].count });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  const result = await sql`
    SELECT count FROM views WHERE content_type = ${type} AND content_id = ${id}::uuid
  `;
  return NextResponse.json({ count: result.rows[0]?.count ?? 0 });
}
```

### `GET /api/search?q=<query>&limit=10`
Searches projects, papers, and posts using Postgres full-text search.

```typescript
// app/api/search/route.ts
export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get('q') ?? '';
  if (q.length < 2) return NextResponse.json([]);

  const query = q.split(' ').map(w => w + ':*').join(' & '); // prefix matching

  const [projects, papers, posts] = await Promise.all([
    sql`SELECT id, slug, name AS title, 'project' AS kind,
        ts_rank(search_vector, to_tsquery('english', ${query})) AS rank
        FROM projects WHERE search_vector @@ to_tsquery('english', ${query})
        AND published = true ORDER BY rank DESC LIMIT 5`,
    sql`SELECT id, slug, title, 'paper' AS kind,
        ts_rank(search_vector, to_tsquery('english', ${query})) AS rank
        FROM papers WHERE search_vector @@ to_tsquery('english', ${query})
        AND published = true ORDER BY rank DESC LIMIT 5`,
    sql`SELECT id, slug, title, 'post' AS kind,
        ts_rank(search_vector, to_tsquery('english', ${query})) AS rank
        FROM posts WHERE search_vector @@ to_tsquery('english', ${query})
        AND published = true ORDER BY rank DESC LIMIT 5`,
  ]);

  const results = [
    ...projects.rows,
    ...papers.rows,
    ...posts.rows,
  ].sort((a, b) => b.rank - a.rank).slice(0, 10);

  return NextResponse.json(results);
}
```

### `GET /api/spotify`
Returns current playing track or last played. Cached at Vercel edge for 30 seconds.

```typescript
// app/api/spotify/route.ts
import { getNowPlaying } from '@/lib/spotify';
import { NextResponse } from 'next/server';

export const revalidate = 30; // ISR: revalidate every 30s

export async function GET() {
  const track = await getNowPlaying();
  return NextResponse.json(track);
}
```

### `POST /api/upload`
Accepts `multipart/form-data` with a `file` field. Uploads to Vercel Blob. Admin only.

```typescript
// app/api/upload/route.ts
import { put } from '@vercel/blob';
import { getSession } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await req.formData();
  const file = form.get('file') as File;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const folder = form.get('folder') as string ?? 'misc';
  const blob = await put(`${folder}/${Date.now()}-${file.name}`, file, {
    access: 'public',
    contentType: file.type,
  });

  // Also record in media table
  await sql`
    INSERT INTO media (filename, blob_url, content_type, size_bytes)
    VALUES (${file.name}, ${blob.url}, ${file.type}, ${file.size})
  `;

  return NextResponse.json({ url: blob.url });
}
```

### CRUD routes pattern (projects, papers, posts)

All follow the same pattern:

```typescript
// app/api/projects/route.ts
export async function GET() { /* list all published */ }
export async function POST(req) { /* admin only: create */ }

// app/api/projects/[id]/route.ts
export async function GET(req, { params }) { /* get one + increment view */ }
export async function PATCH(req, { params }) { /* admin only: update */ }
export async function DELETE(req, { params }) { /* admin only: delete */ }
```

---

## 7. Page & Component Map

### Public Pages

| Route | Type | Data Source | Key Components |
|---|---|---|---|
| `/` | Server Component | DB: 4 featured projects, 2 latest posts, profile | `HeroSection`, `ProjectCard`, `PostCard`, `SpotifyWidget` |
| `/about` | Server Component | DB: profile row | `ProfilePhoto`, `BioBlock`, `BackgroundTimeline`, `SocialLinks` |
| `/projects` | Server Component | DB: all published projects + tags + view counts | `ProjectCard`, `TagFilter` |
| `/projects/[slug]` | Server Component | DB: single project | `ViewCounter` (client), `ProjectDetail`, `RelatedProjects` |
| `/research` | Server Component | DB: all papers + tags | `PaperRow`, `TagFilter` |
| `/research/[slug]` | Server Component | DB: single paper | `ViewCounter`, `PaperDetail`, `AbstractBlock` |
| `/blog` | Server Component | DB: all published posts | `PostCard` (with thumbnail), `TagFilter` |
| `/blog/[slug]` | Server Component | DB: single post MDX | `ViewCounter`, `MdxRenderer`, `PostHeader` |
| `/vision` | Static (no DB) | Hardcoded phases | `Timeline`, `ScenarioCards` |

### Admin Pages (all require session)

| Route | Purpose |
|---|---|
| `/admin` | Dashboard: total views, recent activity, quick-create buttons |
| `/admin/login` | Password form |
| `/admin/projects` | Table of all projects with edit/delete |
| `/admin/projects/new` | Create form with image upload |
| `/admin/projects/[id]/edit` | Edit form pre-filled from DB |
| `/admin/papers` | Same pattern |
| `/admin/papers/new` | Create with PDF upload |
| `/admin/posts` | List with published toggle |
| `/admin/posts/new` | MDX editor with thumbnail upload + preview |
| `/admin/posts/[id]/edit` | Edit post |
| `/admin/media` | Media library grid (all uploaded blobs) |
| `/admin/profile` | Edit bio, avatar, social links |

---

## 8. Feature Specifications

### 8.1 View Counters

**How it works:**

1. Each public content page (`/projects/[slug]`, `/research/[slug]`, `/blog/[slug]`) includes a `<ViewCounter>` client component.
2. On mount, the client component calls `POST /api/views` with the content type and ID.
3. The API upserts a row in the `views` table.
4. The component re-renders with the new count.

**Deduplication strategy:** Set a cookie `viewed_{id}` with 24h expiry. Check for this cookie before incrementing. This prevents a single user from inflating counts on every page load.

```typescript
// components/content/ViewCounter.tsx
'use client';
import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

export function ViewCounter({ type, id }: { type: string; id: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const cookieKey = `viewed_${id}`;
    const alreadyViewed = document.cookie.includes(cookieKey);

    fetch('/api/views', {
      method: alreadyViewed ? 'GET' : 'POST', // GET doesn't increment
      headers: { 'Content-Type': 'application/json' },
      ...(alreadyViewed ? {} : { body: JSON.stringify({ type, id }) }),
    })
      .then(r => r.json())
      .then(d => {
        setCount(d.count);
        if (!alreadyViewed) {
          document.cookie = `${cookieKey}=1; max-age=86400; path=/`;
        }
      });
  }, [id, type]);

  if (count === null) return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-muted">
      <Eye size={12} />
      {count.toLocaleString()}
    </span>
  );
}
```

### 8.2 Image Upload System

**Flow:**

```
User selects file in <ImageUpload> component
        │
        ▼
Client validates: type (image/jpeg|png|webp|gif), size (< 5MB)
        │
        ▼
POST /api/upload with FormData
        │
        ▼
Server: checks admin session, calls put() from @vercel/blob
        │
        ▼
Blob returns public URL → stored in DB field (thumbnail_url etc.)
        │
        ▼
next/image renders with blur placeholder
```

**Component:**

```typescript
// components/ui/ImageUpload.tsx
'use client';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone'; // npm install react-dropzone
import Image from 'next/image';

interface Props {
  value?: string;        // current URL (for edit forms)
  onChange: (url: string) => void;
  folder?: string;       // 'thumbnails' | 'profile' | 'project-imgs'
  aspectRatio?: string;  // '16/9' | '1/1' | '3/2'
}

export function ImageUpload({ value, onChange, folder = 'misc', aspectRatio = '16/9' }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('Max 5MB'); return; }

    setUploading(true);
    setError('');
    const form = new FormData();
    form.append('file', file);
    form.append('folder', folder);

    const res = await fetch('/api/upload', { method: 'POST', body: form });
    const data = await res.json();
    setUploading(false);
    if (data.url) onChange(data.url);
    else setError(data.error ?? 'Upload failed');
  }, [folder, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] },
    maxFiles: 1,
  });

  return (
    <div>
      {value ? (
        <div className="relative group">
          <Image src={value} alt="Upload preview" width={600} height={338}
            className="rounded-md object-cover w-full" style={{ aspectRatio }} />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition">
            Remove
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition
            ${isDragActive ? 'border-bronze bg-bronze/5' : 'border-border hover:border-bronze/50'}`}>
          <input {...getInputProps()} />
          {uploading ? (
            <p className="text-muted text-sm">Uploading…</p>
          ) : (
            <p className="text-muted text-sm">
              Drag & drop an image, or <span className="text-bronze underline">browse</span>
              <br /><span className="text-xs">JPG, PNG, WebP, GIF · max 5MB</span>
            </p>
          )}
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
```

### 8.3 MDX Blog Posts with SVG Animations

Posts are stored as MDX strings in the `posts.content` column. When rendering, `next-mdx-remote` compiles the MDX and passes custom components.

**Custom MDX components** (these can be used inside any post):

```typescript
// components/ui/MdxRenderer.tsx
import { MDXRemote } from 'next-mdx-remote/rsc';

// Custom components available in every post
const components = {
  // Inline SVG animation block
  AnimatedSvg: ({ children }: { children: React.ReactNode }) => (
    <div className="my-8 flex justify-center">{children}</div>
  ),
  // Callout box
  Callout: ({ type = 'info', children }: { type?: 'info'|'warning'|'quote'; children: React.ReactNode }) => (
    <div className={`border-l-2 pl-5 my-6 ${
      type === 'warning' ? 'border-amber-500 bg-amber-500/5' :
      type === 'quote' ? 'border-bronze bg-bronze/5 italic' :
      'border-blue-400 bg-blue-400/5'
    } py-3 pr-4 rounded-r`}>
      {children}
    </div>
  ),
  // Pull quote
  PullQuote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="text-2xl font-serif italic text-center my-10 px-8 text-bronze border-y border-bronze/20 py-6">
      {children}
    </blockquote>
  ),
};

export async function MdxRenderer({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} />;
}
```

**Example post with SVG animation** (what you'd write in the editor):

```mdx
---
title: Why I'm Betting on Continual Learning
---

Every time you fine-tune a large language model, it forgets.

<AnimatedSvg>
  <svg width="300" height="120" viewBox="0 0 300 120" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="40" width="80" height="40" rx="4" fill="#C8963E" opacity="0.2"
      stroke="#C8963E" strokeWidth="1">
      <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2s" repeatCount="indefinite"/>
    </rect>
    <text x="50" y="65" textAnchor="middle" fill="#C8963E" fontSize="11" fontFamily="monospace">
      Task A
    </text>
    <!-- arrow -->
    <line x1="90" y1="60" x2="130" y2="60" stroke="#C8963E" strokeWidth="1.5" markerEnd="url(#arrow)"/>
    <rect x="130" y="40" width="80" height="40" rx="4" fill="#9B8FD4" opacity="0.2"
      stroke="#9B8FD4" strokeWidth="1">
      <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite"/>
    </rect>
    <text x="170" y="65" textAnchor="middle" fill="#9B8FD4" fontSize="11" fontFamily="monospace">
      Task B
    </text>
    <defs>
      <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
        <path d="M 0 0 L 6 3 L 0 6 z" fill="#C8963E"/>
      </marker>
    </defs>
  </svg>
</AnimatedSvg>

<Callout type="quote">
  SOMA borrows this intuition: fast-changing adapters for new tasks, slow-changing frozen adapters for consolidated knowledge.
</Callout>
```

### 8.4 Search

The `SearchBar` component is a client component in the nav. It debounces input (300ms) before hitting `/api/search`.

```typescript
// components/ui/SearchBar.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(async () => {
      if (query.length < 2) { setResults([]); return; }
      setLoading(true);
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      setResults(await res.json());
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, open]);

  // Keyboard shortcut: Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(v => !v);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const kindPath = (kind: string) =>
    kind === 'project' ? '/projects' : kind === 'paper' ? '/research' : '/blog';

  return (
    <>
      <button onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
        className="flex items-center gap-1.5 text-xs font-mono text-muted border border-border rounded px-2 py-1 hover:border-bronze/50 transition">
        <Search size={12} /> Search <kbd className="opacity-50 text-[10px]">⌘K</kbd>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60"
          onClick={e => e.target === e.currentTarget && setOpen(false)}>
          <div className="bg-bg2 border border-border rounded-lg w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 p-3 border-b border-border">
              <Search size={14} className="text-muted" />
              <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search projects, papers, writing…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted" />
              {query && <button onClick={() => setQuery('')}><X size={14} className="text-muted" /></button>}
              <button onClick={() => setOpen(false)}
                className="text-xs font-mono text-muted border border-border rounded px-1.5 py-0.5">esc</button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {loading && <p className="p-4 text-xs text-muted">Searching…</p>}
              {!loading && results.length === 0 && query.length >= 2 && (
                <p className="p-4 text-xs text-muted">No results for "{query}"</p>
              )}
              {results.map(r => (
                <button key={r.id} onClick={() => { router.push(`${kindPath(r.kind)}/${r.slug}`); setOpen(false); }}
                  className="w-full flex justify-between items-center p-3 hover:bg-bronze/5 transition text-left border-b border-border/50">
                  <span className="text-sm font-serif">{r.title}</span>
                  <span className="text-[10px] font-mono text-bronze uppercase tracking-wider">{r.kind}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

### 8.5 Admin Dashboard (Analytics Overview)

```typescript
// app/admin/page.tsx (Server Component)
import { sql } from '@vercel/postgres';

export default async function AdminDashboard() {
  const [totalViews, topContent, recentPosts, counts] = await Promise.all([
    sql`SELECT SUM(count) as total FROM views`,
    sql`
      SELECT v.content_type, v.content_id, v.count,
        COALESCE(p.name, pa.title, po.title) AS title,
        COALESCE(p.slug, pa.slug, po.slug) AS slug
      FROM views v
      LEFT JOIN projects p ON v.content_type = 'project' AND v.content_id = p.id
      LEFT JOIN papers pa ON v.content_type = 'paper' AND v.content_id = pa.id
      LEFT JOIN posts po ON v.content_type = 'post' AND v.content_id = po.id
      ORDER BY v.count DESC LIMIT 10
    `,
    sql`SELECT title, slug, published, created_at FROM posts ORDER BY created_at DESC LIMIT 5`,
    sql`
      SELECT
        (SELECT COUNT(*) FROM projects) as projects,
        (SELECT COUNT(*) FROM papers) as papers,
        (SELECT COUNT(*) FROM posts WHERE published = true) as posts,
        (SELECT COUNT(*) FROM posts WHERE published = false) as drafts
    `,
  ]);

  // render dashboard with these...
}
```

---

## 9. Media & Upload System

### Vercel Blob Setup

1. In Vercel dashboard → Storage → Create Blob Store → name it `portfolio-media`
2. Copy the `BLOB_READ_WRITE_TOKEN` to `.env.local`
3. Install: `npm install @vercel/blob`

### Folder Convention

| Folder | Content |
|---|---|
| `profile/` | Avatar image (one file, overwrite on update) |
| `thumbnails/` | Post and project thumbnail images |
| `project-imgs/` | Additional project screenshots |
| `pdfs/` | Paper PDFs |
| `misc/` | Anything else |

### Allowed File Types

| Type | Extensions | Max Size |
|---|---|---|
| Images | jpg, jpeg, png, webp, gif | 5MB |
| Documents | pdf | 10MB |

### next/image Configuration

```javascript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co',  // Spotify album art
      },
    ],
  },
};
```

---

## 10. Socials & Third-Party Integrations

### Social Links Component

```typescript
// components/socials/SocialLinks.tsx
import { Twitter, Instagram, Youtube, Github, Music } from 'lucide-react';

const SOCIALS = [
  { label: 'Twitter / X', icon: Twitter, href: 'https://x.com/LensenWakasa', handle: '@LensenWakasa' },
  { label: 'Instagram', icon: Instagram, href: 'https://instagram.com/lensenwakasa', handle: '@lensenwakasa' },
  { label: 'YouTube', icon: Youtube, href: 'https://youtube.com/@lensenwakasa', handle: 'YouTube' },
  { label: 'Spotify', icon: Music, href: 'https://open.spotify.com/user/[YOUR_SPOTIFY_ID]', handle: 'Spotify' },
  { label: 'GitHub', icon: Github, href: 'https://github.com/lensenwakasa', handle: 'GitHub' },
];
```

### Spotify Now Playing Widget

**Setup (one-time):**

1. Go to [developer.spotify.com](https://developer.spotify.com) → Create app
2. Add `http://localhost:3000/callback` to Redirect URIs
3. Auth with PKCE flow → get `refresh_token`
4. Store `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` in env

```typescript
// lib/spotify.ts
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';

async function getAccessToken() {
  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
    }),
  });
  return (await res.json()).access_token;
}

export async function getNowPlaying() {
  const token = await getAccessToken();
  const res = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 204 || res.status > 400) {
    // Not playing — get recently played instead
    const recent = await fetch(RECENTLY_PLAYED_ENDPOINT, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await recent.json();
    const track = data.items?.[0]?.track;
    if (!track) return null;
    return {
      isPlaying: false,
      title: track.name,
      artist: track.artists.map((a: any) => a.name).join(', '),
      album: track.album.name,
      albumArt: track.album.images[0]?.url,
      songUrl: track.external_urls.spotify,
    };
  }

  const { item, is_playing } = await res.json();
  return {
    isPlaying: is_playing,
    title: item.name,
    artist: item.artists.map((a: any) => a.name).join(', '),
    album: item.album.name,
    albumArt: item.album.images[0]?.url,
    songUrl: item.external_urls.spotify,
  };
}
```

```typescript
// components/socials/SpotifyWidget.tsx
'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Music } from 'lucide-react';

export function SpotifyWidget() {
  const [track, setTrack] = useState<any>(null);

  useEffect(() => {
    fetch('/api/spotify').then(r => r.json()).then(setTrack);
    const interval = setInterval(() => {
      fetch('/api/spotify').then(r => r.json()).then(setTrack);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!track) return null;

  return (
    <a href={track.songUrl} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-bronze/40 transition group">
      {track.albumArt ? (
        <Image src={track.albumArt} alt={track.album} width={40} height={40}
          className="rounded object-cover flex-shrink-0" />
      ) : (
        <div className="w-10 h-10 bg-bronze/10 rounded flex items-center justify-center flex-shrink-0">
          <Music size={16} className="text-bronze" />
        </div>
      )}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          {track.isPlaying && (
            <span className="flex gap-0.5 items-end h-3">
              {[1,2,3].map(i => (
                <span key={i} className="w-0.5 bg-green-400 rounded-full"
                  style={{ height: `${Math.random() * 8 + 4}px`, animation: `eq ${0.5 + i*0.1}s ease-in-out infinite alternate` }} />
              ))}
            </span>
          )}
          <span className="text-[10px] font-mono text-muted uppercase tracking-wider">
            {track.isPlaying ? 'Now Playing' : 'Last Played'}
          </span>
        </div>
        <p className="text-xs font-medium truncate text-cream">{track.title}</p>
        <p className="text-[11px] text-muted truncate">{track.artist}</p>
      </div>
    </a>
  );
}
```

---

## 11. Authentication & Admin

**Single admin, password-only.** No OAuth. Simple and secure enough for one person.

```typescript
// lib/auth.ts
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  isAdmin: boolean;
}

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), {
    password: process.env.SESSION_SECRET!, // min 32 chars
    cookieName: 'lensen_portfolio_session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  });
}
```

```typescript
// app/api/admin/login/route.ts
import { getSession } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  }
  const session = await getSession();
  session.isAdmin = true;
  await session.save();
  return NextResponse.json({ ok: true });
}
```

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isLoginRoute = req.nextUrl.pathname === '/admin/login';
  const sessionCookie = req.cookies.get('lensen_portfolio_session');

  if (isAdminRoute && !isLoginRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
```

---

## 12. Design System

### CSS Variables

```css
/* styles/globals.css */
:root {
  /* Dark mode (default) */
  --bg:          #0A0804;
  --bg2:         #13100A;
  --bg-card:     #1A1510;
  --bronze:      #C8963E;
  --bronze-dim:  rgba(200, 150, 62, 0.5);
  --bronze-glow: rgba(200, 150, 62, 0.12);
  --cream:       #F5EDD6;
  --cream-muted: #A89472;
  --cream-faint: #5C4E36;
  --border:      rgba(200, 150, 62, 0.14);
  --border-hover:rgba(200, 150, 62, 0.35);
  --muted:       #A89472;
}

[data-theme="light"] {
  --bg:          #FAF6EE;
  --bg2:         #F2E9D6;
  --bg-card:     #FFF8EC;
  --bronze:      #9B6E1A;
  --bronze-dim:  rgba(155, 110, 26, 0.4);
  --bronze-glow: rgba(155, 110, 26, 0.08);
  --cream:       #1A1208;
  --cream-muted: #5C4720;
  --cream-faint: #A8915C;
  --border:      rgba(155, 110, 26, 0.18);
  --border-hover:rgba(155, 110, 26, 0.4);
  --muted:       #5C4720;
}
```

### Tailwind Config

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg:      'var(--bg)',
        bg2:     'var(--bg2)',
        'bg-card': 'var(--bg-card)',
        bronze:  'var(--bronze)',
        cream:   'var(--cream)',
        muted:   'var(--muted)',
        border:  'var(--border)',
      },
      fontFamily: {
        serif:  ['Source Serif 4', 'Georgia', 'serif'],
        display:['Playfair Display', 'Georgia', 'serif'],
        mono:   ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
```

### Type Scale

| Token | Size | Font | Usage |
|---|---|---|---|
| `text-display` | clamp(42px, 8vw, 82px) | Playfair Display 700 | Hero H1 only |
| `text-h1` | clamp(28px, 4vw, 42px) | Playfair Display 700 | Page titles |
| `text-h2` | 24px | Playfair Display 700 | Section headings |
| `text-h3` | 20px | Playfair Display 700 | Card titles |
| `text-body` | 16px | Source Serif 4 400 | All body copy |
| `text-small` | 14px | Source Serif 4 400 | Captions, descriptions |
| `text-label` | 10–11px | JetBrains Mono 500 | Tags, dates, section labels |

### Status Chip Color Map

| Status | Background | Text |
|---|---|---|
| `active` | `rgba(200,150,62,0.15)` | `#C8963E` |
| `building` | `rgba(90,80,160,0.15)` | `#9B8FD4` |
| `research` | `rgba(255,255,255,0.05)` | muted |
| `revenue` | `rgba(60,160,80,0.12)` | `#5DBA70` |

---

## 13. Environment Variables

Create `.env.local` at the root:

```bash
# ── Vercel Postgres ───────────────────────────────────────────
# Auto-injected if you link via Vercel dashboard (Storage → Connect to Project)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=

# ── Vercel Blob ───────────────────────────────────────────────
# From Storage → Blob → your store → .env.local tab
BLOB_READ_WRITE_TOKEN=

# ── Admin Auth ────────────────────────────────────────────────
ADMIN_PASSWORD=choose-a-long-secure-password-here
SESSION_SECRET=minimum-32-character-random-string-here

# ── Spotify ───────────────────────────────────────────────────
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=

# ── Site ─────────────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=https://lensenwakasa.com
```

**How to get Spotify tokens:**

```bash
# Step 1: Visit this URL in browser (replace CLIENT_ID)
https://accounts.spotify.com/authorize?client_id=CLIENT_ID&response_type=code&redirect_uri=http://localhost:3000/callback&scope=user-read-currently-playing,user-read-recently-played

# Step 2: Copy the `code` from the redirect URL
# Step 3: Exchange for tokens
curl -X POST https://accounts.spotify.com/api/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Authorization: Basic BASE64(CLIENT_ID:CLIENT_SECRET)" \
  -d "grant_type=authorization_code&code=CODE&redirect_uri=http://localhost:3000/callback"

# Step 4: Copy refresh_token from response → SPOTIFY_REFRESH_TOKEN
```

---

## 14. Deployment Checklist

### First Deploy

- [ ] Create Vercel project, connect GitHub repo
- [ ] Add Vercel Postgres: Dashboard → Storage → Create Database → Connect to Project
- [ ] Add Vercel Blob: Dashboard → Storage → Create Blob Store → Connect to Project
- [ ] Run schema SQL in Vercel Postgres console (§5)
- [ ] Run seed data SQL (§5 bottom)
- [ ] Add all env vars in Vercel → Project → Settings → Environment Variables
- [ ] Set `NEXT_PUBLIC_SITE_URL` to your actual domain
- [ ] Deploy: `git push origin main` → Vercel auto-deploys
- [ ] Visit `/admin/login`, set password, verify login works
- [ ] Add profile photo via `/admin/profile`
- [ ] Add first project via `/admin/projects/new`
- [ ] Verify view counter increments on `/projects/[slug]`
- [ ] Verify search returns results

### Custom Domain

- [ ] Vercel → Project → Settings → Domains → Add `lensenwakasa.com`
- [ ] Add DNS records at your registrar (Vercel provides exact values)
- [ ] SSL auto-provisions (takes ~5 minutes)

### Performance Targets

| Metric | Target |
|---|---|
| Lighthouse Performance | > 90 |
| Lighthouse SEO | 100 |
| Core Web Vitals LCP | < 2.5s |
| Time to First Byte | < 200ms (Vercel Edge) |

---

## 15. Development Setup

```bash
# Clone and install
git clone https://github.com/lensenwakasa/portfolio
cd portfolio
npm install

# Install key packages
npm install @vercel/postgres @vercel/blob iron-session next-mdx-remote react-dropzone lucide-react

# Copy env template
cp .env.example .env.local
# → Fill in values (at minimum: ADMIN_PASSWORD and SESSION_SECRET for local dev)
# → For local Postgres, use Vercel CLI: `vercel env pull .env.local`

# Run locally
npm run dev
# → http://localhost:3000

# Type-check
npm run type-check

# Build (test before deploying)
npm run build

# Deploy to Vercel
npx vercel --prod
```

### Vercel CLI (recommended)

```bash
npm install -g vercel
vercel login
vercel link          # links local repo to Vercel project
vercel env pull      # pulls all env vars into .env.local automatically
```

### Local Database (optional)

For fully local dev without hitting the cloud DB:

```bash
# Option A: Use the live Vercel Postgres (easier, fine for solo dev)
# Just pull env vars with `vercel env pull`

# Option B: Local Postgres via Docker
docker run --name portfolio-db -e POSTGRES_PASSWORD=dev -p 5432:5432 -d postgres:15
# Then set POSTGRES_URL=postgresql://postgres:dev@localhost:5432/portfolio in .env.local
# Run schema SQL manually via psql
```

---

## 16. Future Roadmap

| Priority | Feature | Effort |
|---|---|---|
| High | Email newsletter (Resend / Buttondown) | 1 day |
| High | OG image auto-generation per post (`@vercel/og`) | 2 hours |
| Medium | RSS feed at `/feed.xml` | 2 hours |
| Medium | Reading progress bar on blog posts | 1 hour |
| Medium | Comment system (giscus — GitHub Discussions based) | 3 hours |
| Medium | Citation generator (BibTeX export for papers) | 2 hours |
| Low | Internationalization (Swahili / English toggle) | 3 days |
| Low | Analytics dashboard with charts (recharts) | 1 day |
| Low | Mobile app via Capacitor (wrap Next.js) | 1 week |
| Low | AI chat interface ("Ask Lensen") via Claude API | 2 days |

---

## Appendix: Key Package Versions

```json
{
  "dependencies": {
    "next": "14.2.x",
    "react": "18.x",
    "react-dom": "18.x",
    "@vercel/postgres": "^0.10.0",
    "@vercel/blob": "^0.24.0",
    "iron-session": "^8.0.1",
    "next-mdx-remote": "^5.0.0",
    "react-dropzone": "^14.2.3",
    "lucide-react": "^0.383.0",
    "tailwindcss": "^3.4.x",
    "typescript": "^5.4.x"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "autoprefixer": "^10.4.x",
    "postcss": "^8.4.x"
  }
}
```

---

*Last updated: June 2026 — Wakasa Labs*