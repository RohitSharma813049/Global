-- 1. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  parent_id uuid references public.categories(id) on delete cascade,
  created_at timestamptz default now()
);

-- 2. Content Types Table
CREATE TABLE IF NOT EXISTS public.content_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon_name text not null,
  created_at timestamptz default now()
);

-- RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_types ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public categories are viewable by everyone." ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public content types are viewable by everyone." ON public.content_types FOR SELECT USING (true);

-- Insert initial content types
INSERT INTO public.content_types (name, slug, icon_name) VALUES
  ('All Content', 'all', 'BookOpen'),
  ('Theses', 'thesis', 'BookOpen'),
  ('Articles', 'article', 'FileText'),
  ('eBooks', 'ebook', 'BookMarked'),
  ('Videos', 'video', 'PlayCircle')
ON CONFLICT (slug) DO NOTHING;

-- Insert initial categories
INSERT INTO public.categories (name, slug) VALUES
  ('Computer Science', 'computer-science'),
  ('Medical Science', 'medical-science'),
  ('Business & Economics', 'business-economics'),
  ('Law & Ethics', 'law-ethics'),
  ('Engineering', 'engineering'),
  ('Arts & Humanities', 'arts-humanities')
ON CONFLICT (slug) DO NOTHING;
