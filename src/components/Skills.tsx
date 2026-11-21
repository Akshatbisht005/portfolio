import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ScrollReveal } from './ScrollReveal'
import { usePortfolioData } from '../context/PortfolioDataContext'
import { SkillGroup as SkillGroupType } from '../types/database'

const LEVEL_COLORS: Record<string, string> = {
  Strong: 'bg-violet-600',
  Proficient: 'bg-violet-400',
  Familiar: 'bg-violet-300',
}

const CHIP_COLORS: Record<string, string> = {
  Product: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
  Analytics: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  Research: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  Tools: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
}

function SkillGroupCard({ group, delay }: { group: SkillGroupType; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduced = useReducedMotion()

  const level = group.level_label || 'Proficient'
  const widthPercent = level === 'Strong' ? '100%' : level === 'Proficient' ? '75%' : '50%'
  const chipClass = CHIP_COLORS[group.group_name] || 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'

  return (
    <ScrollReveal delay={delay}>
      <div ref={ref}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {group.group_name}
          </h3>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${chipClass}`}>
            {level}
          </span>
        </div>

        {/* Animated proficiency fill line (ANIMATION_SPEC requirement) */}
        <div
          className="mb-5 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden"
          aria-label={`${group.group_name} proficiency: ${level}`}
        >
          <motion.div
            className={`h-full rounded-full ${LEVEL_COLORS[level] || 'bg-violet-400'}`}
            initial={{ width: 0 }}
            animate={inView ? { width: widthPercent } : { width: 0 }}
            transition={{ duration: reduced ? 0 : 2, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        {/* Grouped tags/chips */}
        <div className="flex flex-wrap gap-2">
          {(group.skills || []).map(skill => (
            <span
              key={skill.id}
              className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-transform hover:scale-105 ${chipClass}`}
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </ScrollReveal>
  )
}

export function Skills() {
  const { skillGroups } = usePortfolioData()

  return (
    <section className="py-24 px-6 bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
            Skills
          </p>
          <h2 className="font-display text-4xl font-bold text-slate-900 dark:text-white">
            My toolkit
          </h2>
        </ScrollReveal>

        <div className="grid gap-10 sm:grid-cols-2">
          {skillGroups.map((group, i) => (
            <SkillGroupCard key={group.id} group={group} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}
