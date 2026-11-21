import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'
import { usePortfolioData } from '../context/PortfolioDataContext'

export function HireBanner() {
  const { settings } = usePortfolioData()
  const reduced = useReducedMotion()

  if (settings.hire_banner_visible === false) return null

  return (
    <section
      aria-label="Hire me"
      className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-violet-600 to-violet-700 dark:from-violet-700 dark:to-violet-800"
    >
      {!reduced && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          animate={{
            background: [
              'radial-gradient(ellipse at 20% 50%, rgba(167,139,250,0.2) 0%, transparent 60%)',
              'radial-gradient(ellipse at 80% 50%, rgba(167,139,250,0.2) 0%, transparent 60%)',
              'radial-gradient(ellipse at 20% 50%, rgba(167,139,250,0.2) 0%, transparent 60%)',
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <div className="relative mx-auto max-w-4xl text-center">
        <ScrollReveal>
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold text-white">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" aria-hidden="true" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" aria-hidden="true" />
            </span>
            <Sparkles size={14} aria-hidden="true" className="ml-1" />
            Currently available
          </span>

          <p className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
            {settings.hire_banner_text}
          </p>

          <a
            href="#contact"
            onClick={e => {
              e.preventDefault()
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-violet-700 hover:bg-violet-50 shadow-lg shadow-violet-900/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Hire me
          </a>
        </ScrollReveal>
      </div>
    </section>
  )
}
