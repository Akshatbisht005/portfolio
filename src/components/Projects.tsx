import { useState } from 'react'
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Tag, ExternalLink } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'
import { ProjectModal } from './ProjectModal'
import { usePortfolioData } from '../context/PortfolioDataContext'
import { ProjectItem } from '../types/database'

function ProjectCard({ project, onClick }: { project: ProjectItem; onClick: () => void }) {
  const reduced = useReducedMotion()

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduced ? {} : { y: -6 }}
      className={`group relative flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer ${
        project.is_featured ? 'md:col-span-2' : ''
      }`}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${project.title}`}
    >
      {/* Thumbnail area */}
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-violet-100 to-slate-100 dark:from-violet-950/60 dark:to-slate-800 ${
          project.is_featured ? 'h-56' : 'h-44'
        }`}
      >
        {project.is_featured && (
          <span className="absolute top-4 left-4 z-10 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white">
            Featured
          </span>
        )}

        {/* Hover overlay per ANIMATION_SPEC */}
        <div
          className="absolute inset-0 bg-violet-900/0 group-hover:bg-violet-900/70 transition-colors duration-400 flex items-end justify-center pb-8 z-10"
          aria-hidden="true"
        >
          <div className="group-hover:translate-y-0 group-hover:opacity-100 translate-y-5 opacity-0 transition-all duration-400 text-center px-4">
            <p className="text-white font-semibold text-lg">{project.title}</p>
            <p className="text-violet-200 text-sm">{project.category}</p>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl font-display font-bold text-violet-200/40 dark:text-violet-700/30 select-none group-hover:scale-110 transition-transform duration-700">
            {project.title.charAt(0)}
          </span>
        </div>

        <span className="absolute bottom-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 dark:bg-slate-900/90 text-violet-600 shadow group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
          <ArrowUpRight size={16} aria-hidden="true" />
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
          {project.category}
        </p>
        <h3 className="mb-2 font-display text-xl font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
          {project.title}
        </h3>
        <p className="mb-4 flex-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
          {project.summary}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 4).map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-400"
            >
              <Tag size={9} aria-hidden="true" />
              {tag}
            </span>
          ))}
        </div>

        {project.prototype_url && (
          <a
            href={project.prototype_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 dark:text-violet-400 hover:underline"
            aria-label={`View prototype for ${project.title} (opens in new tab)`}
          >
            <ExternalLink size={13} aria-hidden="true" />
            View prototype
          </a>
        )}
      </div>
    </motion.article>
  )
}

export function Projects() {
  const { projects } = usePortfolioData()
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState<ProjectItem | null>(null)

  // Dynamically extract all filter tags
  const tagsSet = new Set<string>(['All'])
  projects.forEach(p => (p.filter_tags || []).forEach(t => tagsSet.add(t)))
  const filterList = Array.from(tagsSet)

  const filtered =
    filter === 'All'
      ? projects
      : projects.filter(p => (p.filter_tags || []).includes(filter))

  return (
    <section id="portfolio" className="py-24 px-6 bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
            Portfolio
          </p>
          <h2 className="font-display text-4xl font-bold text-slate-900 dark:text-white">
            My work
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            End-to-end product projects — from discovery to PRD to prototype.
          </p>
        </ScrollReveal>

        {/* Filter buttons */}
        <ScrollReveal className="mb-10 flex flex-wrap justify-center gap-2">
          {filterList.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                filter === f
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400'
              }`}
              aria-pressed={filter === f}
            >
              {f}
            </button>
          ))}
        </ScrollReveal>

        <LayoutGroup>
          <div className="grid gap-6 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {filtered.map(project => (
                <ProjectCard key={project.id} project={project} onClick={() => setSelected(project)} />
              ))}
            </AnimatePresence>
          </div>
        </LayoutGroup>
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
