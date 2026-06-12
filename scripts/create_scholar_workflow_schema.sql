-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text default 'reader',
  created_at timestamptz default now()
);

-- 2. Scholar Applications Table
CREATE TABLE IF NOT EXISTS public.scholar_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  full_name text,
  qualification text,
  institution text,
  specialization text,
  documents jsonb,
  status text default 'pending',
  admin_notes text,
  created_at timestamptz default now()
);

-- 3. Scholars Table
-- We already created a 'scholars' table previously. We will update/recreate it based on the new spec.
-- If you already ran the previous script, you may need to DROP TABLE public.scholars CASCADE; first.
CREATE TABLE IF NOT EXISTS public.scholars (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id),
  bio text,
  institution text,
  qualification text,
  specialization text,
  verified boolean default true,
  total_views integer default 0,
  total_downloads integer default 0
);

-- Note: The new schema diverges slightly from the original GSPDistinguishedScholars static template.
-- We will adapt the components to use these new fields.

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholar_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholars ENABLE ROW LEVEL SECURITY;

-- Public read access for scholars
CREATE POLICY "Public profiles are viewable by everyone." ON public.scholars FOR SELECT USING (true);
CREATE POLICY "Users can view their own applications." ON public.scholar_applications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create applications." ON public.scholar_applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
