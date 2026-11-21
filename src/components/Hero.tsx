import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, Download } from 'lucide-react'
import { usePortfolioData } from '../context/PortfolioDataContext'

export function Hero() {
  const { settings } = usePortfolioData()
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1500)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      id="welcome"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-32 text-center"
      aria-label="Hero"
    >
      {/* Animated background blobs */}
      {!reduced && (
        <>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 -right-32 h-[520px] w-[520px] rounded-full bg-violet-400/20 dark:bg-violet-700/20 blur-3xl"
            animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 -left-32 h-[400px] w-[400px] rounded-full bg-indigo-400/15 dark:bg-indigo-700/15 blur-3xl"
            animate={{ x: [0, -20, 30, 0], y: [0, 30, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* Background gradient overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-100 via-white to-slate-50 dark:from-violet-950/40 dark:via-slate-950 dark:to-slate-950"
      />

      <div className="relative z-10 max-w-3xl">
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 32 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: reduced ? 0 : 32 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            {settings.profile_image_url && settings.profile_image_url !== '/profile.jpg' ? (
              <img
                src={settings.profile_image_url}
                alt={settings.name}
                className="h-28 w-28 rounded-full object-cover shadow-2xl shadow-violet-300 dark:shadow-violet-900/60 ring-4 ring-white dark:ring-slate-950"
              />
            ) : (
              <div
                className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-violet-700 text-3xl font-bold text-white shadow-2xl shadow-violet-300 dark:shadow-violet-900/60 ring-4 ring-white dark:ring-slate-950"
                aria-label={`${settings.name} — profile`}
              >
                RR
              </div>
            )}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: reduced ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="mb-2 text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400"
        >
          {settings.hero_greeting}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: reduced ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="font-display mb-6 text-5xl font-bold leading-tight text-slate-900 dark:text-white sm:text-6xl md:text-7xl"
        >
          {settings.hero_headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: reduced ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="mb-10 mx-auto max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400"
        >
          {settings.hero_subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: reduced ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#portfolio"
            onClick={e => {
              e.preventDefault()
              document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-200 dark:shadow-violet-900/40 hover:bg-violet-700 transition-all hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
          >
            View my work <ArrowDown size={16} aria-hidden="true" />
          </a>
          <a
            href={settings.resume_file_url || '/resume.pdf'}
            download="Rohit_Rawat_Resume.pdf"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 dark:border-slate-700 px-8 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-violet-600 hover:text-violet-600 dark:hover:border-violet-400 dark:hover:text-violet-400 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Download size={16} aria-hidden="true" /> Download resume
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      {ready && !reduced && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          aria-hidden="true"
        >
          <span className="text-xs text-slate-400 tracking-widest uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ArrowDown size={16} className="text-slate-400" />
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
