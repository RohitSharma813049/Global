-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: scholars
CREATE TABLE IF NOT EXISTS public.scholars (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Optional link to auth user
    
    -- Profile Info
    name TEXT NOT NULL,
    initials TEXT NOT NULL,
    professional_role TEXT NOT NULL,
    description TEXT NOT NULL,
    
    -- Location & Domain
    country TEXT NOT NULL,
    country_code TEXT NOT NULL, -- e.g., 'UAE', 'USA'
    flag_emoji TEXT NOT NULL,
    domain TEXT NOT NULL,
    
    -- Badges
    is_honorary BOOLEAN DEFAULT false NOT NULL,
    is_verified BOOLEAN DEFAULT false NOT NULL,
    is_featured BOOLEAN DEFAULT false NOT NULL
);

-- Table: scholar_videos
CREATE TABLE IF NOT EXISTS public.scholar_videos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    scholar_id UUID REFERENCES public.scholars(id) ON DELETE CASCADE NOT NULL,
    
    title TEXT NOT NULL,
    metadata TEXT NOT NULL, -- e.g., "14:32 · Recorded at GSP"
    video_url TEXT NOT NULL,
    is_main_video BOOLEAN DEFAULT false NOT NULL
);

-- Table: scholar_publications
CREATE TABLE IF NOT EXISTS public.scholar_publications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    scholar_id UUID REFERENCES public.scholars(id) ON DELETE CASCADE NOT NULL,
    
    title TEXT NOT NULL,
    metadata TEXT NOT NULL, -- e.g., "Global Scholar Publications · 2024"
    tag TEXT NOT NULL, -- e.g., "Article", "eBook", "Magazine"
    url TEXT -- Optional link to publication
);

-- Table: scholar_achievements (optional, for "Key contributions")
CREATE TABLE IF NOT EXISTS public.scholar_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    scholar_id UUID REFERENCES public.scholars(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL
);


-- Row Level Security (RLS)
ALTER TABLE public.scholars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholar_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholar_publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholar_achievements ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all scholars data
CREATE POLICY "Public profiles are viewable by everyone." 
    ON public.scholars FOR SELECT USING (true);
    
CREATE POLICY "Public videos are viewable by everyone." 
    ON public.scholar_videos FOR SELECT USING (true);
    
CREATE POLICY "Public publications are viewable by everyone." 
    ON public.scholar_publications FOR SELECT USING (true);

CREATE POLICY "Public achievements are viewable by everyone." 
    ON public.scholar_achievements FOR SELECT USING (true);

-- To restrict inserts/updates to authenticated admins only, we'll keep it simple for now:
-- Only allow authenticated users to modify (Assuming admin check is handled at app layer or via role)
CREATE POLICY "Authenticated users can insert scholars" 
    ON public.scholars FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update scholars" 
    ON public.scholars FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete scholars" 
    ON public.scholars FOR DELETE TO authenticated USING (true);

-- Similar for related tables...
CREATE POLICY "Authenticated users can manage videos" 
    ON public.scholar_videos FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage publications" 
    ON public.scholar_publications FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage achievements" 
    ON public.scholar_achievements FOR ALL TO authenticated USING (true);
