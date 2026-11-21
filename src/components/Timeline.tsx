import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Briefcase, GraduationCap, Download } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'
import { usePortfolioData } from '../context/PortfolioDataContext'
import { WorkExperienceItem, EducationItem } from '../types/database'

function WorkCard({ item, index }: { item: WorkExperienceItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduced = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: reduced ? 0 : -32 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.4, delay: index * 0.15 + 0.2, type: 'spring', stiffness: 200 }}
        className="absolute -left-[11px] top-0 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-white dark:bg-slate-950 border-violet-600 text-violet-600"
        aria-hidden="true"
      >
        <Briefcase size={9} />
      </motion.div>

      <div className="pb-10">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {item.period}
        </p>
        <h4 className="font-semibold text-slate-900 dark:text-white">{item.role}</h4>
        {item.organization && (
          <p className="text-sm text-violet-600 dark:text-violet-400 font-medium">
            {item.organization}
            {item.location ? `, ${item.location}` : ''}
          </p>
        )}
        <ul className="mt-3 space-y-1.5">
          {item.bullets.map((b, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-300 dark:bg-slate-600" aria-hidden="true" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

function EducationCard({ item, index }: { item: EducationItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduced = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: reduced ? 0 : 32 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.4, delay: index * 0.15 + 0.2, type: 'spring', stiffness: 200 }}
        className="absolute -left-[11px] top-0 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-white dark:bg-slate-950 border-emerald-500 text-emerald-500"
        aria-hidden="true"
      >
        <GraduationCap size={9} />
      </motion.div>

      <div className="pb-10">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {item.period}
        </p>
        <h4 className="font-semibold text-slate-900 dark:text-white">{item.title}</h4>
        {item.institution && (
          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
            {item.institution}
          </p>
        )}
        <ul className="mt-3 space-y-1.5">
          {item.details.map((b, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-300 dark:bg-slate-600" aria-hidden="true" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

export function Timeline() {
  const { workExperience, education, settings } = usePortfolioData()

  return (
    <section id="curriculum" className="py-24 px-6 bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
            Curriculum
          </p>
          <h2 className="font-display text-4xl font-bold text-slate-900 dark:text-white">
            Experience &amp; education
          </h2>
        </ScrollReveal>

        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <ScrollReveal className="mb-8">
              <h3 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white text-lg">
                <Briefcase size={18} className="text-violet-600 dark:text-violet-400" aria-hidden="true" />
                Work experience
              </h3>
            </ScrollReveal>
            {workExperience.map((item, i) => (
              <WorkCard key={item.id} item={item} index={i} />
            ))}
          </div>

          <div>
            <ScrollReveal className="mb-8">
              <h3 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white text-lg">
                <GraduationCap size={18} className="text-emerald-500" aria-hidden="true" />
                Education &amp; certifications
              </h3>
            </ScrollReveal>
            {education.map((item, i) => (
              <EducationCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>

        <ScrollReveal className="mt-12 flex justify-center">
          <a
            href={settings.resume_file_url || '/resume.pdf'}
            download
            className="inline-flex items-center gap-2 rounded-full border-2 border-violet-600 px-8 py-3.5 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:bg-violet-600 hover:text-white dark:hover:bg-violet-600 dark:hover:text-white transition-all shadow-sm"
          >
            <Download size={16} aria-hidden="true" />
            Download resume (PDF)
          </a>
        </ScrollReveal>
      </div>
    </section>
  )
}
