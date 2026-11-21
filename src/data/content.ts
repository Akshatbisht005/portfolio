// ============================================================
// content.ts — Default / Seed / Fallback data
// Used when Supabase is unreachable or unconfigured
// ============================================================

import {
  SiteSettings,
  FactItem,
  WhatIDoItem,
  SkillGroup,
  ProjectItem,
  WorkExperienceItem,
  EducationItem,
  ToolStripItem,
} from '../types/database'

export const fallbackSettings: SiteSettings = {
  id: 'default',
  name: 'Rohit Rawat',
  title: 'Associate Product Manager',
  title_sub: 'Consumer and AI Products',
  hero_greeting: "Hi, I'm Rohit",
  hero_headline: 'Associate Product Manager.',
  hero_subtitle: 'I turn user research into shipped-ready product decisions — consumer tech and AI.',
  about_text: [
    'Entry-level Product Manager with an AI-First Product Management certification (Airtribe, 2026) and an MCA (2022).',
    'Completed 3 end-to-end product projects, including a BookMyShow discovery feature built from a 19-response survey, 3 user interviews, RICE scoring of 15 ideas, a PRD and a working prototype.',
    'Basic SQL, plus experience in teaching and legal operations that built strong documentation, communication and stakeholder skills.',
    'Seeking an APM or PM role in consumer technology.',
  ],
  location: 'Noida, India',
  email: 'rohanrwt9278@gmail.com',
  phone: '+91 7895769509',
  linkedin_url: 'https://linkedin.com/in/rohit-rawat-b732973a2',
  linkedin_handle: 'linkedin.com/in/rohit-rawat-b732973a2',
  prototype_url: 'https://preview--portfoliorohitrawat.lovable.app',
  resume_file_url: '/resume.pdf',
  profile_image_url: '/profile.jpg',
  hire_banner_text: "I'm currently open to APM / Associate PM roles in consumer tech.",
  hire_banner_visible: true,
  seo_title: 'Rohit Rawat | Associate Product Manager',
  seo_description: 'Rohit Rawat — Associate Product Manager specialising in consumer technology and AI products. Based in Noida, India.',
  footer_text: '© 2026 Rohit Rawat',
  accent_color: '#7c3aed',
  theme_default: 'light',
}

export const fallbackFacts: FactItem[] = [
  { id: '1', label: 'Based in', value: 'Noida, India', icon_key: 'MapPin', sort_order: 1, is_published: true },
  { id: '2', label: 'Seeking', value: 'APM / PM roles', icon_key: 'Briefcase', sort_order: 2, is_published: true },
  { id: '3', label: 'Focus', value: 'Consumer tech, EdTech, AI products', icon_key: 'Zap', sort_order: 3, is_published: true },
  { id: '4', label: 'Certified', value: 'AI-First PM (Airtribe, 2026)', icon_key: 'Award', sort_order: 4, is_published: true },
]

export const fallbackWhatIDo: WhatIDoItem[] = [
  {
    id: '1',
    title: 'Discovery & Research',
    description: 'Surveys, user interviews, and root cause analysis to understand why users behave the way they do — then turn findings into clear problem statements.',
    icon: 'Search',
    sort_order: 1,
    is_published: true,
  },
  {
    id: '2',
    title: 'Prioritisation & PRDs',
    description: 'RICE and MoSCoW frameworks to rank what ships next. Crisp PRDs with user stories and testable, unambiguous requirements.',
    icon: 'FileText',
    sort_order: 2,
    is_published: true,
  },
  {
    id: '3',
    title: 'Metrics & Rollout',
    description: 'North star and guardrail metrics, event tracking specs, and gated rollout plans so every launch is measurable and reversible.',
    icon: 'BarChart2',
    sort_order: 3,
    is_published: true,
  },
]

export const fallbackSkillGroups: SkillGroup[] = [
  {
    id: 'g1',
    group_name: 'Product',
    level_label: 'Strong',
    sort_order: 1,
    is_published: true,
    skills: [
      { id: 's1', group_id: 'g1', name: 'PRD Writing', level_label: 'Strong', sort_order: 1, is_published: true },
      { id: 's2', group_id: 'g1', name: 'User Stories', level_label: 'Strong', sort_order: 2, is_published: true },
      { id: 's3', group_id: 'g1', name: 'RICE Prioritisation', level_label: 'Strong', sort_order: 3, is_published: true },
      { id: 's4', group_id: 'g1', name: 'MoSCoW Prioritisation', level_label: 'Strong', sort_order: 4, is_published: true },
      { id: 's5', group_id: 'g1', name: 'Product Roadmapping', level_label: 'Strong', sort_order: 5, is_published: true },
      { id: 's6', group_id: 'g1', name: 'Go-to-Market Planning', level_label: 'Strong', sort_order: 6, is_published: true },
      { id: 's7', group_id: 'g1', name: 'A/B Testing', level_label: 'Strong', sort_order: 7, is_published: true },
    ],
  },
  {
    id: 'g2',
    group_name: 'Analytics',
    level_label: 'Proficient',
    sort_order: 2,
    is_published: true,
    skills: [
      { id: 's8', group_id: 'g2', name: 'Funnel Analysis', level_label: 'Proficient', sort_order: 1, is_published: true },
      { id: 's9', group_id: 'g2', name: 'Cohort Analysis', level_label: 'Proficient', sort_order: 2, is_published: true },
      { id: 's10', group_id: 'g2', name: 'North Star Metrics', level_label: 'Proficient', sort_order: 3, is_published: true },
      { id: 's11', group_id: 'g2', name: 'Guardrail Metrics', level_label: 'Proficient', sort_order: 4, is_published: true },
      { id: 's12', group_id: 'g2', name: 'Event Tracking', level_label: 'Proficient', sort_order: 5, is_published: true },
      { id: 's13', group_id: 'g2', name: 'SQL (basic)', level_label: 'Proficient', sort_order: 6, is_published: true },
      { id: 's14', group_id: 'g2', name: 'Excel', level_label: 'Proficient', sort_order: 7, is_published: true },
      { id: 's15', group_id: 'g2', name: 'Google Sheets', level_label: 'Proficient', sort_order: 8, is_published: true },
    ],
  },
  {
    id: 'g3',
    group_name: 'Research',
    level_label: 'Strong',
    sort_order: 3,
    is_published: true,
    skills: [
      { id: 's16', group_id: 'g3', name: 'User Interviews', level_label: 'Strong', sort_order: 1, is_published: true },
      { id: 's17', group_id: 'g3', name: 'Surveys', level_label: 'Strong', sort_order: 2, is_published: true },
      { id: 's18', group_id: 'g3', name: 'User Personas', level_label: 'Strong', sort_order: 3, is_published: true },
      { id: 's19', group_id: 'g3', name: 'Competitive Analysis', level_label: 'Strong', sort_order: 4, is_published: true },
      { id: 's20', group_id: 'g3', name: 'Root Cause Analysis', level_label: 'Strong', sort_order: 5, is_published: true },
    ],
  },
  {
    id: 'g4',
    group_name: 'Tools',
    level_label: 'Proficient',
    sort_order: 4,
    is_published: true,
    skills: [
      { id: 's21', group_id: 'g4', name: 'Jira', level_label: 'Proficient', sort_order: 1, is_published: true },
      { id: 's22', group_id: 'g4', name: 'Figma', level_label: 'Proficient', sort_order: 2, is_published: true },
      { id: 's23', group_id: 'g4', name: 'Notion', level_label: 'Proficient', sort_order: 3, is_published: true },
      { id: 's24', group_id: 'g4', name: 'Lovable', level_label: 'Proficient', sort_order: 4, is_published: true },
      { id: 's25', group_id: 'g4', name: 'Claude', level_label: 'Proficient', sort_order: 5, is_published: true },
      { id: 's26', group_id: 'g4', name: 'ChatGPT', level_label: 'Proficient', sort_order: 6, is_published: true },
    ],
  },
]

export const fallbackToolsStrip: ToolStripItem[] = [
  { id: 't1', name: 'Jira', icon_key: 'jira', url: '', sort_order: 1, is_published: true },
  { id: 't2', name: 'Figma', icon_key: 'figma', url: '', sort_order: 2, is_published: true },
  { id: 't3', name: 'Notion', icon_key: 'notion', url: '', sort_order: 3, is_published: true },
  { id: 't4', name: 'Lovable', icon_key: 'lovable', url: '', sort_order: 4, is_published: true },
  { id: 't5', name: 'Claude', icon_key: 'claude', url: '', sort_order: 5, is_published: true },
  { id: 't6', name: 'ChatGPT', icon_key: 'openai', url: '', sort_order: 6, is_published: true },
  { id: 't7', name: 'PRD Writing', icon_key: 'file-text', url: '', sort_order: 7, is_published: true },
  { id: 't8', name: 'RICE', icon_key: 'target', url: '', sort_order: 8, is_published: true },
  { id: 't9', name: 'MoSCoW', icon_key: 'layers', url: '', sort_order: 9, is_published: true },
  { id: 't10', name: 'User Research', icon_key: 'users', url: '', sort_order: 10, is_published: true },
  { id: 't11', name: 'Funnel Analysis', icon_key: 'filter', url: '', sort_order: 11, is_published: true },
  { id: 't12', name: 'SQL', icon_key: 'database', url: '', sort_order: 12, is_published: true },
  { id: 't13', name: 'A/B Testing', icon_key: 'git-compare', url: '', sort_order: 13, is_published: true },
  { id: 't14', name: 'Roadmapping', icon_key: 'map', url: '', sort_order: 14, is_published: true },
]

export const fallbackProjects: ProjectItem[] = [
  {
    id: 'p1',
    slug: 'bookmyshow',
    title: 'BookMyShow: Quick Decide',
    category: 'Entertainment Discovery · Airtribe Capstone',
    timeframe: 'Jul 2026',
    summary:
      'Designed a discovery feature for BookMyShow that eliminates comparison-stage decision paralysis — a 3-tap quiz returning 2–3 ranked picks, each with a one-line reason.',
    outcomes: [
      'Surveyed 19 users and interviewed 3 to find why users with no plan browse but do not book.',
      '79% start discovery on Instagram or Google; 53% struggle to compare options.',
      'Isolated comparison-stage decision paralysis as the main leak: 32% abandon, 11% book on a rival app.',
      'Ruled out off-platform discovery and price as root causes.',
      'Scored 15 ideas with RICE; merged top three (Filters 216, Compare View 149, Quiz 144) into one feature.',
      'Wrote a PRD with 5 user stories and 5 testable requirements (≤3 taps, <2 s latency).',
      'Built a clickable prototype in Lovable covering the flow from home to seat selection.',
      'Target: 18–32% discovery-led conversion in 6 months; 12 metrics, 8-event tracking spec, 4-phase gated rollout starting with 5% of Bangalore users.',
    ],
    tags: ['Discovery', 'RICE', 'PRD', 'Prototype', 'Metrics'],
    filter_tags: ['Consumer', 'Research', 'PRD'],
    cover_image_url: '/projects/bookmyshow-1.png',
    gallery_urls: ['/projects/bookmyshow-1.png', '/projects/bookmyshow-2.png'],
    prototype_url: 'https://preview--portfoliorohitrawat.lovable.app',
    prd_url: '/projects/bookmyshow-prd.pdf',
    is_featured: true,
    sort_order: 1,
    is_published: true,
  },
  {
    id: 'p2',
    slug: 'edtech-recommendation',
    title: 'Personalised Learning Recommendation System',
    category: 'EdTech · Airtribe Project',
    timeframe: 'Jan – Mar 2025',
    summary:
      'PRD for an AI-driven course recommendation engine targeting a 20% uplift in course completion rates.',
    outcomes: [
      'Wrote a PRD covering 3 user personas and 12 user stories, with functional and non-functional requirements.',
      'Benchmarked 5 competitor EdTech platforms and used RICE to prioritise AI-driven recommendations.',
      'Targeted a 20% uplift in course completion.',
      'Defined 4 success metrics (DAU, NPS, 30-day completion rate, feature adoption) with baselines and targets.',
    ],
    tags: ['EdTech', 'AI', 'PRD', 'Competitive Analysis'],
    filter_tags: ['EdTech', 'PRD', 'Research'],
    cover_image_url: '',
    gallery_urls: [],
    prototype_url: '',
    prd_url: '',
    is_featured: false,
    sort_order: 2,
    is_published: true,
  },
  {
    id: 'p3',
    slug: 'saas-ux',
    title: 'UI/UX Improvement PRD',
    category: 'B2B SaaS · Product Design Sprint',
    timeframe: 'Jun – Jul 2025',
    summary:
      'A 15-page PRD for a B2B SaaS website analysis tool, with gamification targeting a 25% retention gain.',
    outcomes: [
      'Wrote a 15-page PRD using MoSCoW prioritisation, with user flows for 3 personas and gamification features targeting a 25% retention gain.',
      'Created onboarding documentation used by 2 teams, cutting onboarding time for new feature rollouts from 5 days to 2.',
    ],
    tags: ['B2B SaaS', 'MoSCoW', 'UX', 'Documentation'],
    filter_tags: ['SaaS', 'PRD'],
    cover_image_url: '',
    gallery_urls: [],
    prototype_url: '',
    prd_url: '',
    is_featured: false,
    sort_order: 3,
    is_published: true,
  },
]

export const fallbackWorkExperience: WorkExperienceItem[] = [
  {
    id: 'w1',
    role: 'Paralegal Executive',
    organization: 'Law Firm',
    location: 'Delhi',
    period: 'Jul 2024 – Present',
    is_current: true,
    bullets: [
      'Manage documentation for 60+ active case files with 100% accuracy.',
      'Redesigned the internal filing system, cutting document retrieval time by ~30%.',
      'Summarise complex legal matters for 10+ clients a month.',
      'Coordinate case reporting with 5+ internal and external stakeholders.',
    ],
    sort_order: 1,
    is_published: true,
  },
  {
    id: 'w2',
    role: 'Teacher',
    organization: '',
    period: 'Oct 2022 – Jun 2024',
    is_current: false,
    bullets: [
      'Delivered lessons and assessed student progress, adapting explanations to different learning levels.',
      'Communicated regularly with students and parents on progress and learning needs.',
    ],
    sort_order: 2,
    is_published: true,
  },
]

export const fallbackEducation: EducationItem[] = [
  {
    id: 'e1',
    title: 'AI-First Product Management Certification',
    institution: 'Airtribe',
    period: 'Apr 2026 – Aug 2026',
    details: ['PRD Writing, Funnel and Cohort Analysis, Root Cause Analysis, A/B Testing, Agile, AI Product Strategy.'],
    sort_order: 1,
    is_published: true,
  },
  {
    id: 'e2',
    title: 'MCA — Master of Computer Applications',
    institution: 'Hemwati Nandan Bahuguna Garhwal University',
    period: '2020 – 2022',
    details: ['Database Management, Software Engineering, Object-Oriented Programming, IT Project Management.'],
    sort_order: 2,
    is_published: true,
  },
]
