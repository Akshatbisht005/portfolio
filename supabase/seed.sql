-- ============================================================
-- Supabase Seed Data for Rohit Rawat Portfolio
-- ============================================================

-- 1. Seed Admin Email
INSERT INTO public.admins (email)
VALUES ('rohanrwt9278@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- 2. Seed Site Settings
INSERT INTO public.site_settings (
    id, name, title, title_sub, hero_greeting, hero_headline, hero_subtitle,
    about_text, location, email, phone, linkedin_url, linkedin_handle,
    prototype_url, resume_file_url, profile_image_url,
    hire_banner_text, hire_banner_visible,
    seo_title, seo_description, footer_text, accent_color, theme_default
) VALUES (
    'default',
    'Rohit Rawat',
    'Associate Product Manager',
    'Consumer and AI Products',
    'Hi, I''m Rohit',
    'Associate Product Manager.',
    'I turn user research into shipped-ready product decisions — consumer tech and AI.',
    ARRAY[
        'Entry-level Product Manager with an AI-First Product Management certification (Airtribe, 2026) and an MCA (2022).',
        'Completed 3 end-to-end product projects, including a BookMyShow discovery feature built from a 19-response survey, 3 user interviews, RICE scoring of 15 ideas, a PRD and a working prototype.',
        'Basic SQL, plus experience in teaching and legal operations that built strong documentation, communication and stakeholder skills.',
        'Seeking an APM or PM role in consumer technology.'
    ],
    'Noida, India',
    'rohanrwt9278@gmail.com',
    '+91 7895769509',
    'https://linkedin.com/in/rohit-rawat-b732973a2',
    'linkedin.com/in/rohit-rawat-b732973a2',
    'https://preview--portfoliorohitrawat.lovable.app',
    '/resume.pdf',
    '/profile.jpg',
    'I''m currently open to APM / Associate PM roles in consumer tech.',
    TRUE,
    'Rohit Rawat | Associate Product Manager',
    'Rohit Rawat — Associate Product Manager specialising in consumer technology and AI products. Based in Noida, India.',
    '© 2026 Rohit Rawat',
    '#7c3aed',
    'light'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    hero_headline = EXCLUDED.hero_headline,
    hero_subtitle = EXCLUDED.hero_subtitle,
    about_text = EXCLUDED.about_text,
    updated_at = NOW();

-- 3. Seed Facts
DELETE FROM public.facts;
INSERT INTO public.facts (label, value, icon_key, sort_order, is_published) VALUES
('Based in', 'Noida, India', 'MapPin', 1, TRUE),
('Seeking', 'APM / PM roles', 'Briefcase', 2, TRUE),
('Focus', 'Consumer tech, EdTech, AI products', 'Zap', 3, TRUE),
('Certified', 'AI-First PM (Airtribe, 2026)', 'Award', 4, TRUE);

-- 4. Seed What I Do
DELETE FROM public.what_i_do;
INSERT INTO public.what_i_do (title, description, icon, sort_order, is_published) VALUES
(
    'Discovery & Research',
    'Surveys, user interviews, and root cause analysis to understand why users behave the way they do — then turn findings into clear problem statements.',
    'Search',
    1,
    TRUE
),
(
    'Prioritisation & PRDs',
    'RICE and MoSCoW frameworks to rank what ships next. Crisp PRDs with user stories and testable, unambiguous requirements.',
    'FileText',
    2,
    TRUE
),
(
    'Metrics & Rollout',
    'North star and guardrail metrics, event tracking specs, and gated rollout plans so every launch is measurable and reversible.',
    'BarChart2',
    3,
    TRUE
);

-- 5. Seed Skill Groups and Skills
DELETE FROM public.skills;
DELETE FROM public.skill_groups;

DO $$
DECLARE
    group_prod UUID := gen_random_uuid();
    group_analytics UUID := gen_random_uuid();
    group_research UUID := gen_random_uuid();
    group_tools UUID := gen_random_uuid();
BEGIN
    INSERT INTO public.skill_groups (id, group_name, level_label, sort_order, is_published) VALUES
    (group_prod, 'Product', 'Strong', 1, TRUE),
    (group_analytics, 'Analytics', 'Proficient', 2, TRUE),
    (group_research, 'Research', 'Strong', 3, TRUE),
    (group_tools, 'Tools', 'Proficient', 4, TRUE);

    -- Product Skills
    INSERT INTO public.skills (group_id, name, level_label, sort_order, is_published) VALUES
    (group_prod, 'PRD Writing', 'Strong', 1, TRUE),
    (group_prod, 'User Stories', 'Strong', 2, TRUE),
    (group_prod, 'RICE Prioritisation', 'Strong', 3, TRUE),
    (group_prod, 'MoSCoW Prioritisation', 'Strong', 4, TRUE),
    (group_prod, 'Product Roadmapping', 'Strong', 5, TRUE),
    (group_prod, 'Go-to-Market Planning', 'Strong', 6, TRUE),
    (group_prod, 'A/B Testing', 'Strong', 7, TRUE);

    -- Analytics Skills
    INSERT INTO public.skills (group_id, name, level_label, sort_order, is_published) VALUES
    (group_analytics, 'Funnel Analysis', 'Proficient', 1, TRUE),
    (group_analytics, 'Cohort Analysis', 'Proficient', 2, TRUE),
    (group_analytics, 'North Star Metrics', 'Proficient', 3, TRUE),
    (group_analytics, 'Guardrail Metrics', 'Proficient', 4, TRUE),
    (group_analytics, 'Event Tracking', 'Proficient', 5, TRUE),
    (group_analytics, 'SQL (basic)', 'Proficient', 6, TRUE),
    (group_analytics, 'Excel', 'Proficient', 7, TRUE),
    (group_analytics, 'Google Sheets', 'Proficient', 8, TRUE);

    -- Research Skills
    INSERT INTO public.skills (group_id, name, level_label, sort_order, is_published) VALUES
    (group_research, 'User Interviews', 'Strong', 1, TRUE),
    (group_research, 'Surveys', 'Strong', 2, TRUE),
    (group_research, 'User Personas', 'Strong', 3, TRUE),
    (group_research, 'Competitive Analysis', 'Strong', 4, TRUE),
    (group_research, 'Root Cause Analysis', 'Strong', 5, TRUE);

    -- Tools Skills
    INSERT INTO public.skills (group_id, name, level_label, sort_order, is_published) VALUES
    (group_tools, 'Jira', 'Proficient', 1, TRUE),
    (group_tools, 'Figma', 'Proficient', 2, TRUE),
    (group_tools, 'Notion', 'Proficient', 3, TRUE),
    (group_tools, 'Lovable', 'Proficient', 4, TRUE),
    (group_tools, 'Claude', 'Proficient', 5, TRUE),
    (group_tools, 'ChatGPT', 'Proficient', 6, TRUE);
END $$;

-- 6. Seed Tools Strip
DELETE FROM public.tools_strip;
INSERT INTO public.tools_strip (name, icon_key, url, sort_order, is_published) VALUES
('Jira', 'jira', '', 1, TRUE),
('Figma', 'figma', '', 2, TRUE),
('Notion', 'notion', '', 3, TRUE),
('Lovable', 'lovable', '', 4, TRUE),
('Claude', 'claude', '', 5, TRUE),
('ChatGPT', 'openai', '', 6, TRUE),
('PRD Writing', 'file-text', '', 7, TRUE),
('RICE', 'target', '', 8, TRUE),
('MoSCoW', 'layers', '', 9, TRUE),
('User Research', 'users', '', 10, TRUE),
('Funnel Analysis', 'filter', '', 11, TRUE),
('SQL', 'database', '', 12, TRUE),
('A/B Testing', 'git-compare', '', 13, TRUE),
('Roadmapping', 'map', '', 14, TRUE);

-- 7. Seed Projects
DELETE FROM public.projects;
INSERT INTO public.projects (
    slug, title, category, timeframe, summary, outcomes, tags, filter_tags,
    cover_image_url, gallery_urls, prototype_url, prd_url, is_featured, sort_order, is_published
) VALUES
(
    'bookmyshow',
    'BookMyShow: Quick Decide',
    'Entertainment Discovery · Airtribe Capstone',
    'Jul 2026',
    'Designed a discovery feature for BookMyShow that eliminates comparison-stage decision paralysis — a 3-tap quiz returning 2–3 ranked picks, each with a one-line reason.',
    ARRAY[
        'Surveyed 19 users and interviewed 3 to find why users with no plan browse but do not book.',
        '79% start discovery on Instagram or Google; 53% struggle to compare options.',
        'Isolated comparison-stage decision paralysis as the main leak: 32% abandon, 11% book on a rival app.',
        'Ruled out off-platform discovery and price as root causes.',
        'Scored 15 ideas with RICE; merged top three (Filters 216, Compare View 149, Quiz 144) into one feature.',
        'Wrote a PRD with 5 user stories and 5 testable requirements (≤3 taps, <2 s latency).',
        'Built a clickable prototype in Lovable covering the flow from home to seat selection.',
        'Target: 18–32% discovery-led conversion in 6 months; 12 metrics, 8-event tracking spec, 4-phase gated rollout starting with 5% of Bangalore users.'
    ],
    ARRAY['Discovery', 'RICE', 'PRD', 'Prototype', 'Metrics'],
    ARRAY['Consumer', 'Research', 'PRD'],
    '/projects/bookmyshow-1.png',
    ARRAY['/projects/bookmyshow-1.png', '/projects/bookmyshow-2.png'],
    'https://preview--portfoliorohitrawat.lovable.app',
    '/projects/bookmyshow-prd.pdf',
    TRUE,
    1,
    TRUE
),
(
    'edtech-recommendation',
    'Personalised Learning Recommendation System',
    'EdTech · Airtribe Project',
    'Jan – Mar 2025',
    'PRD for an AI-driven course recommendation engine targeting a 20% uplift in course completion rates.',
    ARRAY[
        'Wrote a PRD covering 3 user personas and 12 user stories, with functional and non-functional requirements.',
        'Benchmarked 5 competitor EdTech platforms and used RICE to prioritise AI-driven recommendations.',
        'Targeted a 20% uplift in course completion.',
        'Defined 4 success metrics (DAU, NPS, 30-day completion rate, feature adoption) with baselines and targets.'
    ],
    ARRAY['EdTech', 'AI', 'PRD', 'Competitive Analysis'],
    ARRAY['EdTech', 'PRD', 'Research'],
    '',
    ARRAY[]::TEXT[],
    '',
    '',
    FALSE,
    2,
    TRUE
),
(
    'saas-ux',
    'UI/UX Improvement PRD',
    'B2B SaaS · Product Design Sprint',
    'Jun – Jul 2025',
    'A 15-page PRD for a B2B SaaS website analysis tool, with gamification targeting a 25% retention gain.',
    ARRAY[
        'Wrote a 15-page PRD using MoSCoW prioritisation, with user flows for 3 personas and gamification features targeting a 25% retention gain.',
        'Created onboarding documentation used by 2 teams, cutting onboarding time for new feature rollouts from 5 days to 2.'
    ],
    ARRAY['B2B SaaS', 'MoSCoW', 'UX', 'Documentation'],
    ARRAY['SaaS', 'PRD'],
    '',
    ARRAY[]::TEXT[],
    '',
    '',
    FALSE,
    3,
    TRUE
);

-- 8. Seed Work Experience
DELETE FROM public.work_experience;
INSERT INTO public.work_experience (
    role, organization, location, start_date, end_date, period, is_current, bullets, sort_order, is_published
) VALUES
(
    'Paralegal Executive',
    'Law Firm',
    'Delhi',
    'Jul 2024',
    'Present',
    'Jul 2024 – Present',
    TRUE,
    ARRAY[
        'Manage documentation for 60+ active case files with 100% accuracy.',
        'Redesigned the internal filing system, cutting document retrieval time by ~30%.',
        'Summarise complex legal matters for 10+ clients a month.',
        'Coordinate case reporting with 5+ internal and external stakeholders.'
    ],
    1,
    TRUE
),
(
    'Teacher',
    '',
    '',
    'Oct 2022',
    'Jun 2024',
    'Oct 2022 – Jun 2024',
    FALSE,
    ARRAY[
        'Delivered lessons and assessed student progress, adapting explanations to different learning levels.',
        'Communicated regularly with students and parents on progress and learning needs.'
    ],
    2,
    TRUE
);

-- 9. Seed Education
DELETE FROM public.education;
INSERT INTO public.education (
    title, institution, period, details, sort_order, is_published
) VALUES
(
    'AI-First Product Management Certification',
    'Airtribe',
    'Apr 2026 – Aug 2026',
    ARRAY['PRD Writing, Funnel and Cohort Analysis, Root Cause Analysis, A/B Testing, Agile, AI Product Strategy.'],
    1,
    TRUE
),
(
    'MCA — Master of Computer Applications',
    'Hemwati Nandan Bahuguna Garhwal University',
    '2020 – 2022',
    ARRAY['Database Management, Software Engineering, Object-Oriented Programming, IT Project Management.'],
    2,
    TRUE
);
