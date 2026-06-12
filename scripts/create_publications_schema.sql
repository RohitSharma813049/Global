-- Table: publications
CREATE TABLE IF NOT EXISTS public.publications (
  id uuid primary key default gen_random_uuid(),
  scholar_id uuid references public.scholars(id) ON DELETE CASCADE,
  title text NOT NULL,
  abstract text NOT NULL,
  content_type text NOT NULL, -- e.g., 'thesis', 'article', 'ebook'
  file_url text NOT NULL,
  doi text,
  status text default 'draft', -- 'draft', 'submitted', 'under_review', 'changes_requested', 'approved', 'published', 'rejected'
  views integer default 0,
  downloads integer default 0,
  created_at timestamptz default now()
);

-- Enable Row Level Security
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;

-- Public can view published publications
CREATE POLICY "Published publications are viewable by everyone." 
  ON public.publications FOR SELECT 
  USING (status = 'published');

-- Scholars can view their own publications (even drafts)
CREATE POLICY "Scholars can view their own publications." 
  ON public.publications FOR SELECT TO authenticated 
  USING (scholar_id IN (SELECT id FROM public.scholars WHERE user_id = auth.uid()));

-- Scholars can insert their own publications
CREATE POLICY "Scholars can create publications." 
  ON public.publications FOR INSERT TO authenticated 
  WITH CHECK (scholar_id IN (SELECT id FROM public.scholars WHERE user_id = auth.uid()));

-- Scholars can update their own publications
CREATE POLICY "Scholars can update their own publications." 
  ON public.publications FOR UPDATE TO authenticated 
  USING (scholar_id IN (SELECT id FROM public.scholars WHERE user_id = auth.uid()));
