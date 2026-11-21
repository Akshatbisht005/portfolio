import { useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X, ExternalLink, FileText, Tag } from 'lucide-react'
import { ProjectItem } from '../types/database'

interface Props {
  project: ProjectItem | null
  onClose: () => void
}

export function ProjectModal({ project, onClose }: Props) {
  const reduced = useReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!project) return
    closeRef.current?.focus()
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', h)
      document.body.style.overflow = ''
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 32, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 32, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400 mb-1">
                  {project.category}
                </p>
                <h2 id="modal-title" className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                  {project.title}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{project.timeframe}</p>
              </div>
              <button
                ref={closeRef}
                onClick={onClose}
                aria-label="Close project details"
                className="mt-1 flex-shrink-0 rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-6 space-y-6">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{project.summary}</p>

              <div>
                <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">Key outcomes</h3>
                <ul className="space-y-2.5">
                  {project.outcomes.map((o, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <span className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-violet-600 dark:text-violet-400 text-xs font-bold">
                        {i + 1}
                      </span>
                      {o}
                    </li>
                  ))}
                </ul>
              </div>

              {project.gallery_urls && project.gallery_urls.length > 0 && (
                <div>
                  <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">Gallery</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {project.gallery_urls.map((url, i) => (
                      <div key={i} className="aspect-video rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <img src={url} alt={`${project.title} screenshot ${i+1}`} className="w-full h-full object-cover" onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    <Tag size={10} aria-hidden="true" />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                {project.prototype_url && (
                  <a
                    href={project.prototype_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
                  >
                    <ExternalLink size={14} aria-hidden="true" />
                    View prototype
                  </a>
                )}
                {project.prd_url && (
                  <a
                    href={project.prd_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-violet-600 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    <FileText size={14} aria-hidden="true" />
                    View PRD
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
