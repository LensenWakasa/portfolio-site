
CREATE TABLE IF NOT EXISTS projects (
  id serial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  summary text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'active',
  tags text[] NOT NULL DEFAULT '{}',
  link text,
  cover_url text,
  year text,
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  views integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS papers (
  id serial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  abstract text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  authors text NOT NULL DEFAULT '',
  venue text,
  year text,
  link text,
  pdf_url text,
  tags text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  views integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS posts (
  id serial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  year text,
  published_at timestamptz NOT NULL DEFAULT now(),
  tags text[] NOT NULL DEFAULT '{}',
  views integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_projects" ON projects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "insert_projects" ON projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_projects" ON projects FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_projects" ON projects FOR DELETE TO authenticated USING (true);

CREATE POLICY "select_papers" ON papers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "insert_papers" ON papers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_papers" ON papers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_papers" ON papers FOR DELETE TO authenticated USING (true);

CREATE POLICY "select_posts" ON posts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "insert_posts" ON posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_posts" ON posts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_posts" ON posts FOR DELETE TO authenticated USING (true);
