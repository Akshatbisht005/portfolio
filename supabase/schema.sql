-- ============================================================
-- Supabase Schema Migration for Rohit Rawat Portfolio
-- ============================================================

-- Enable pgcrypto for UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Helper function to check if current authenticated user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins 
    WHERE user_id = auth.uid() OR email = (auth.jwt() ->> 'email')
  ) OR ((auth.jwt() ->> 'email') = 'rohanrwt9278@gmail.com');
$$;

-- 2. Site Settings Table (Single Row)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    name TEXT NOT NULL DEFAULT 'Rohit Rawat',
    title TEXT NOT NULL DEFAULT 'Associate Product Manager',
    title_sub TEXT NOT NULL DEFAULT 'Consumer and AI Products',
    hero_greeting TEXT NOT NULL DEFAULT 'Hi, I''m Rohit',
    hero_headline TEXT NOT NULL DEFAULT 'Associate Product Manager.',
    hero_subtitle TEXT NOT NULL DEFAULT 'I turn user research into shipped-ready product decisions — consumer tech and AI.',
    about_text TEXT[] NOT NULL DEFAULT '{}',
    location TEXT NOT NULL DEFAULT 'Noida, India',
    email TEXT NOT NULL DEFAULT 'rohanrwt9278@gmail.com',
    phone TEXT NOT NULL DEFAULT '+91 7895769509',
    linkedin_url TEXT NOT NULL DEFAULT 'https://linkedin.com/in/rohit-rawat-b732973a2',
    linkedin_handle TEXT NOT NULL DEFAULT 'linkedin.com/in/rohit-rawat-b732973a2',
    prototype_url TEXT DEFAULT 'https://preview--portfoliorohitrawat.lovable.app',
    resume_file_url TEXT DEFAULT '/resume.pdf',
    profile_image_url TEXT DEFAULT '',
    hire_banner_text TEXT NOT NULL DEFAULT 'I''m currently open to APM / Associate PM roles in consumer tech.',
    hire_banner_visible BOOLEAN DEFAULT TRUE,
    seo_title TEXT NOT NULL DEFAULT 'Rohit Rawat | Associate Product Manager',
    seo_description TEXT NOT NULL DEFAULT 'Rohit Rawat — Associate Product Manager specialising in consumer technology and AI products.',
    footer_text TEXT NOT NULL DEFAULT '© 2026 Rohit Rawat',
    accent_color TEXT DEFAULT '#7c3aed',
    theme_default TEXT DEFAULT 'light',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Facts Table
CREATE TABLE IF NOT EXISTS public.facts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    icon_key TEXT NOT NULL DEFAULT 'MapPin',
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. What I Do Table
CREATE TABLE IF NOT EXISTS public.what_i_do (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'Search',
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Skill Groups Table
CREATE TABLE IF NOT EXISTS public.skill_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_name TEXT NOT NULL,
    level_label TEXT NOT NULL DEFAULT 'Strong',
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.skill_groups(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    level_label TEXT DEFAULT 'Proficient',
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Tools Strip Table
CREATE TABLE IF NOT EXISTS public.tools_strip (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    icon_key TEXT DEFAULT '',
    url TEXT DEFAULT '',
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    timeframe TEXT NOT NULL,
    summary TEXT NOT NULL,
    outcomes TEXT[] NOT NULL DEFAULT '{}',
    tags TEXT[] NOT NULL DEFAULT '{}',
    filter_tags TEXT[] NOT NULL DEFAULT '{}',
    cover_image_url TEXT DEFAULT '',
    gallery_urls TEXT[] DEFAULT '{}',
    prototype_url TEXT DEFAULT '',
    prd_url TEXT DEFAULT '',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Work Experience Table
CREATE TABLE IF NOT EXISTS public.work_experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role TEXT NOT NULL,
    organization TEXT NOT NULL,
    location TEXT DEFAULT '',
    start_date TEXT DEFAULT '',
    end_date TEXT DEFAULT '',
    period TEXT NOT NULL,
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    bullets TEXT[] NOT NULL DEFAULT '{}',
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Education Table
CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    institution TEXT NOT NULL,
    period TEXT NOT NULL,
    details TEXT[] NOT NULL DEFAULT '{}',
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Messages Table (Contact Form)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 100),
    email TEXT NOT NULL CHECK (char_length(email) >= 5 AND char_length(email) <= 255),
    message TEXT NOT NULL CHECK (char_length(message) >= 10 AND char_length(message) <= 5000),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rate Limiting Trigger Function for Messages (Reject > 5 messages per email in 1 hour)
CREATE OR REPLACE FUNCTION public.check_message_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    recent_count INT;
BEGIN
    SELECT COUNT(*) INTO recent_count
    FROM public.messages
    WHERE email = LOWER(TRIM(NEW.email))
      AND created_at > (NOW() - INTERVAL '1 hour');

    IF recent_count >= 5 THEN
        RAISE EXCEPTION 'Too many messages sent. Please wait before submitting another message.'
            USING ERRCODE = 'P0001';
    END IF;

    NEW.name := TRIM(NEW.name);
    NEW.email := LOWER(TRIM(NEW.email));
    NEW.message := TRIM(NEW.message);

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_message_rate_limit ON public.messages;
CREATE TRIGGER trigger_message_rate_limit
    BEFORE INSERT ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.check_message_rate_limit();

-- Auto-update updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_name IN ('site_settings', 'facts', 'what_i_do', 'skill_groups', 'skills', 'tools_strip', 'projects', 'work_experience', 'education')
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS trigger_update_%I ON public.%I', t, t);
        EXECUTE format('CREATE TRIGGER trigger_update_%I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column()', t, t);
    END LOOP;
END;
$$;

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.what_i_do ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools_strip ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Admins table policies
CREATE POLICY "Admins can view and manage admins"
    ON public.admins FOR ALL
    USING (public.is_admin());

-- Site Settings policies
CREATE POLICY "Public can view site settings"
    ON public.site_settings FOR SELECT
    USING (true);

CREATE POLICY "Admins can update site settings"
    ON public.site_settings FOR ALL
    USING (public.is_admin());

-- Facts policies
CREATE POLICY "Public can view published facts"
    ON public.facts FOR SELECT
    USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can manage facts"
    ON public.facts FOR ALL
    USING (public.is_admin());

-- What I Do policies
CREATE POLICY "Public can view published what_i_do"
    ON public.what_i_do FOR SELECT
    USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can manage what_i_do"
    ON public.what_i_do FOR ALL
    USING (public.is_admin());

-- Skill Groups policies
CREATE POLICY "Public can view published skill_groups"
    ON public.skill_groups FOR SELECT
    USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can manage skill_groups"
    ON public.skill_groups FOR ALL
    USING (public.is_admin());

-- Skills policies
CREATE POLICY "Public can view published skills"
    ON public.skills FOR SELECT
    USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can manage skills"
    ON public.skills FOR ALL
    USING (public.is_admin());

-- Tools Strip policies
CREATE POLICY "Public can view published tools_strip"
    ON public.tools_strip FOR SELECT
    USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can manage tools_strip"
    ON public.tools_strip FOR ALL
    USING (public.is_admin());

-- Projects policies
CREATE POLICY "Public can view published projects"
    ON public.projects FOR SELECT
    USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can manage projects"
    ON public.projects FOR ALL
    USING (public.is_admin());

-- Work Experience policies
CREATE POLICY "Public can view published work_experience"
    ON public.work_experience FOR SELECT
    USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can manage work_experience"
    ON public.work_experience FOR ALL
    USING (public.is_admin());

-- Education policies
CREATE POLICY "Public can view published education"
    ON public.education FOR SELECT
    USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can manage education"
    ON public.education FOR ALL
    USING (public.is_admin());

-- Messages policies
-- PUBLIC CAN ONLY INSERT, NEVER SELECT/UPDATE/DELETE
CREATE POLICY "Public can insert messages"
    ON public.messages FOR INSERT
    WITH CHECK (true);

-- ONLY ADMINS CAN SELECT/UPDATE/DELETE MESSAGES
CREATE POLICY "Admins can view and manage messages"
    ON public.messages FOR ALL
    USING (public.is_admin());

-- ============================================================
-- STORAGE BUCKET CONFIGURATION
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'site-assets',
    'site-assets',
    true,
    5242880, -- 5 MB in bytes
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];

-- Storage bucket RLS policies
CREATE POLICY "Public can read site-assets"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'site-assets');

CREATE POLICY "Admins can upload to site-assets"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'site-assets' AND public.is_admin());

CREATE POLICY "Admins can update site-assets"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'site-assets' AND public.is_admin());

CREATE POLICY "Admins can delete site-assets"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'site-assets' AND public.is_admin());
