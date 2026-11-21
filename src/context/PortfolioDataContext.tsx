import React, { createContext, useContext, useEffect, useState } from 'react'
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
import {
  fallbackSettings,
  fallbackFacts,
  fallbackWhatIDo,
  fallbackSkillGroups,
  fallbackToolsStrip,
  fallbackProjects,
  fallbackWorkExperience,
  fallbackEducation,
} from '../data/content'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

interface PortfolioDataContextType {
  settings: SiteSettings
  facts: FactItem[]
  whatIDo: WhatIDoItem[]
  skillGroups: SkillGroup[]
  toolsStrip: ToolStripItem[]
  projects: ProjectItem[]
  workExperience: WorkExperienceItem[]
  education: EducationItem[]
  isLoading: boolean
  isLive: boolean
  refetch: () => Promise<void>
}

const PortfolioDataContext = createContext<PortfolioDataContextType>({
  settings: fallbackSettings,
  facts: fallbackFacts,
  whatIDo: fallbackWhatIDo,
  skillGroups: fallbackSkillGroups,
  toolsStrip: fallbackToolsStrip,
  projects: fallbackProjects,
  workExperience: fallbackWorkExperience,
  education: fallbackEducation,
  isLoading: false,
  isLive: false,
  refetch: async () => {},
})

export function PortfolioDataProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(fallbackSettings)
  const [facts, setFacts] = useState<FactItem[]>(fallbackFacts)
  const [whatIDo, setWhatIDo] = useState<WhatIDoItem[]>(fallbackWhatIDo)
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>(fallbackSkillGroups)
  const [toolsStrip, setToolsStrip] = useState<ToolStripItem[]>(fallbackToolsStrip)
  const [projects, setProjects] = useState<ProjectItem[]>(fallbackProjects)
  const [workExperience, setWorkExperience] = useState<WorkExperienceItem[]>(fallbackWorkExperience)
  const [education, setEducation] = useState<EducationItem[]>(fallbackEducation)
  const [isLoading, setIsLoading] = useState<boolean>(isSupabaseConfigured)
  const [isLive, setIsLive] = useState<boolean>(false)

  const fetchData = async () => {
    if (!isSupabaseConfigured) {
      setIsLoading(false)
      setIsLive(false)
      return
    }

    try {
      // 1. Settings
      const { data: sData } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'default')
        .single()
      if (sData) setSettings(sData)

      // 2. Facts
      const { data: fData } = await supabase
        .from('facts')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
      if (fData && fData.length > 0) setFacts(fData)

      // 3. What I Do
      const { data: wData } = await supabase
        .from('what_i_do')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
      if (wData && wData.length > 0) setWhatIDo(wData)

      // 4. Skills & Groups
      const { data: sgData } = await supabase
        .from('skill_groups')
        .select('*, skills(*)')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
      if (sgData && sgData.length > 0) {
        setSkillGroups(
          sgData.map(group => ({
            ...group,
            skills: (group.skills || [])
              .filter((s: any) => s.is_published)
              .sort((a: any, b: any) => a.sort_order - b.sort_order),
          }))
        )
      }

      // 5. Tools Strip
      const { data: tData } = await supabase
        .from('tools_strip')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
      if (tData && tData.length > 0) setToolsStrip(tData)

      // 6. Projects
      const { data: pData } = await supabase
        .from('projects')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
      if (pData && pData.length > 0) setProjects(pData)

      // 7. Work Experience
      const { data: weData } = await supabase
        .from('work_experience')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
      if (weData && weData.length > 0) setWorkExperience(weData)

      // 8. Education
      const { data: eData } = await supabase
        .from('education')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
      if (eData && eData.length > 0) setEducation(eData)

      setIsLive(true)
    } catch (err) {
      console.warn('Supabase fetch failed, using fallback content:', err)
      setIsLive(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <PortfolioDataContext.Provider
      value={{
        settings,
        facts,
        whatIDo,
        skillGroups,
        toolsStrip,
        projects,
        workExperience,
        education,
        isLoading,
        isLive,
        refetch: fetchData,
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  )
}

export function usePortfolioData() {
  return useContext(PortfolioDataContext)
}
