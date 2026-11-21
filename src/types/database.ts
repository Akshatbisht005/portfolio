export interface SiteSettings {
  id: string
  name: string
  title: string
  title_sub: string
  hero_greeting: string
  hero_headline: string
  hero_subtitle: string
  about_text: string[]
  location: string
  email: string
  phone: string
  linkedin_url: string
  linkedin_handle: string
  prototype_url: string
  resume_file_url: string
  profile_image_url: string
  hire_banner_text: string
  hire_banner_visible: boolean
  seo_title: string
  seo_description: string
  footer_text: string
  accent_color: string
  theme_default: string
  updated_at?: string
}

export interface FactItem {
  id: string
  label: string
  value: string
  icon_key: string
  sort_order: number
  is_published: boolean
  created_at?: string
  updated_at?: string
}

export interface WhatIDoItem {
  id: string
  title: string
  description: string
  icon: string
  sort_order: number
  is_published: boolean
  created_at?: string
  updated_at?: string
}

export interface SkillItem {
  id: string
  group_id: string
  name: string
  level_label: string
  sort_order: number
  is_published: boolean
}

export interface SkillGroup {
  id: string
  group_name: string
  level_label: string
  sort_order: number
  is_published: boolean
  skills?: SkillItem[]
}

export interface ToolStripItem {
  id: string
  name: string
  icon_key: string
  url: string
  sort_order: number
  is_published: boolean
}

export interface ProjectItem {
  id: string
  slug: string
  title: string
  category: string
  timeframe: string
  summary: string
  outcomes: string[]
  tags: string[]
  filter_tags: string[]
  cover_image_url: string
  gallery_urls: string[]
  prototype_url: string
  prd_url: string
  is_featured: boolean
  sort_order: number
  is_published: boolean
  created_at?: string
  updated_at?: string
}

export interface WorkExperienceItem {
  id: string
  role: string
  organization: string
  location?: string
  start_date?: string
  end_date?: string
  period: string
  is_current: boolean
  bullets: string[]
  sort_order: number
  is_published: boolean
}

export interface EducationItem {
  id: string
  title: string
  institution: string
  period: string
  details: string[]
  sort_order: number
  is_published: boolean
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  is_read: boolean
  created_at: string
}
